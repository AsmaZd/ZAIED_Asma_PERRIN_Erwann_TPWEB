import { Injectable } from '@nestjs/common';
import { Association } from './association.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Repository, Timestamp } from 'typeorm';
import { Role } from 'src/roles/role.entity';
import { Member } from './association.member';
import { AssociationDTO } from './association.dto';
import { Minute } from 'src/minutes/minute.entity';
import { query } from 'express';

/*
const associations : Association[] = [
    {
        id: 0,
        idUsers: [0, 0],
        name: 'john au carré'
    }
]
*/

@Injectable()
export class AssociationService {

    constructor(
        private service: UsersService,

        @InjectRepository(Association)
        private repository: Repository<Association>,
        @InjectRepository(Minute)
        private minuteRepository: Repository<Minute>,
    ) {}


    // Transforme une association en associationDTO
    private async toDTO(association: Association): Promise<AssociationDTO> {
        const dto = new AssociationDTO();
        dto.id = association.id;
        dto.name = association.name;
    
        // Charger les rôles associés à l'association
        const roles = await this.repository.manager.getRepository(Role).find({
          where: { association: { id: association.id } },
          relations: ['user'], 
        });
    
        const members: Member[] = roles.map((role) => {
          const member = new Member();     
          member.firstname = role.user.firstname;
          member.lastname = role.user.lastname;
          member.age = role.user.age;
          member.role = role.name;
          return member;
        });
    
        dto.members = members;
        return dto;
    }

    //Get
    public async getAllAssociations(): Promise<AssociationDTO[]>{
        const associations = await this.repository.find();
        return Promise.all(associations.map(association => this.toDTO(association)));
    }

    public async getById(idToFind): Promise<AssociationDTO>{
        let filteredId = await this.repository.findOneBy({id: Equal(idToFind)});
        return this.toDTO(filteredId);
    }

    public async getMembers(idToFind): Promise<User[]>{

       const userId = await this.repository.findOne({
            where: {id: Equal(idToFind)},
            select: ['users']
        });
        
        return userId ? userId.users : [] ;
    }

    
    public async getProcesByAssociation(id: number, sort: string, order: 'ASC' | 'DESC'): Promise<{content: string; date: Date}[]> {
        const validSortFields = ['date', 'content'];
        if (!validSortFields.includes(sort)) {
            throw new Error(`Invalid sort field: ${sort}`);
        }
    
        const query = this.minuteRepository.createQueryBuilder('minute')
            .select(['minute.content', 'minute.date'])
            .where('minute.associationId = :id', { id }) 
            .orderBy(`minute.${sort}`, order as 'ASC' | 'DESC'); 
    
        const minutes = await query.getMany();
        return minutes;
    }

    //Post
    public async create(idUsers: number[], name: string): Promise<Association>{

        const users = await this.repository.manager.getRepository(User).findBy({ id: In(idUsers) });

        const newAssociation = this.repository.create({
            name: name,
            users: users
        })

        await this.repository.save(newAssociation);
        return newAssociation;
    }

    //Put
    public async putAssociation(idToFind, name: string, idUsers: number[]): Promise<Association>{
        let filteredId : Association = await this.repository.findOneBy(idToFind); 

        if (idUsers !== undefined){

            const users = await this.repository.manager.getRepository(User).findBy({
                id: In(idUsers),
            });

            filteredId.users = users;
        }
        if (name !== undefined){
            filteredId.name = name;
        }
        await this.repository.save(filteredId)
        return filteredId;
    }

    //Delete
    public async deleteAssociation(idToFind): Promise<number>{
        const index = this.repository.findOneBy(idToFind);
        if (!index){
            return 1;
        }
        return 0;
    }
}
