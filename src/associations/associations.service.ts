import { Injectable } from '@nestjs/common';
import { Association } from './association.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Repository, Timestamp } from 'typeorm';
import { Role } from 'src/roles/role.entity';
//import { AssociationDTO } from './association.dto';
import { Member } from './association.member';
import { AssociationDTO } from './association.dto';
import { Minute } from 'src/minutes/minute.entity';
import { query } from 'express';
//import { AssociationDTO } from './association.dto';

/*
const associations : Association[] = [
    {
        id: 0,
        idUsers: [0, 0],
        name: 'john au carré'
    }
]
*/


//let id: number = 0;

@Injectable()
export class AssociationService {

    constructor(
        private service: UsersService,

        @InjectRepository(Association)
        private repository: Repository<Association>,
        @InjectRepository(Minute)
        private minuteRepository: Repository<Minute>,
        /*
        @InjectRepository(User)
        private userRepository: Repository<User>*/
    ) {}


    // Transforme une association en associationDTO
    private async toDTO(association: Association): Promise<AssociationDTO> {
        const dto = new AssociationDTO();
        dto.id = association.id;
        dto.name = association.name;
    
        // Charger les rôles associés à l'association
        const roles = await this.repository.manager.getRepository(Role).find({
          where: { association: { id: association.id } },
          relations: ['user'], // Charger les utilisateurs liés aux rôles
        });
    
        // Transformer les utilisateurs et leurs rôles en membres
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
        let filteredId = await this.repository.findOneBy(idToFind);
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
        console.log(id)
        console.log(sort)
        console.log(order)

        const validSortFields = ['date', 'content'];
        if (!validSortFields.includes(sort)) {
            throw new Error(`Invalid sort field: ${sort}`);
        }
    
        // Créer la requête en utilisant les champs validés
        const query = this.minuteRepository.createQueryBuilder('minute')
            .select(['minute.content', 'minute.date'])
            .where('minute.associationId = :id', { id }) // Utilisation de paramètres sécurisés
            .orderBy(`minute.${sort}`, order as 'ASC' | 'DESC'); // Champ validé inséré directement
    
        // Debugging: Afficher la requête SQL générée
        console.log('Generated SQL:', query.getSql());
    
        const minutes = await query.getMany();
        return minutes;
    }

/*
    public async getAssociationsByUser(idToFind: number): Promise<Association[]> {
        // Cherche l'utilisateur avec ses associations
        const user = await this.userRepository.findOne({
        where: { id: idToFind },
        relations: ['associations'], // Charger les associations avec l'utilisateur
        });

        return user.associations; // Retourner les associations de l'utilisateur
    }
        
*/
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
