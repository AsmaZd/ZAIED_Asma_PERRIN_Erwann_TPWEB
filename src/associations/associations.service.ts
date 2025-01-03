import { Injectable } from '@nestjs/common';
import { Association } from './association.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Repository } from 'typeorm';

/*
const associations : Association[] = [
    {
        id: 0,
        idUsers: [0, 0],
        name: 'john au carré'
    }
]
*/


let id: number = 0;

@Injectable()
export class AssociationService {

    constructor(
        private service: UsersService,

        @InjectRepository(Association)
        private repository: Repository<Association>
    ) {}

    //Get
    public async getAllAssociations(): Promise<Association[]>{
        return this.repository.find();
    }

    public async getById(idToFind): Promise<Association>{
        let filteredId: Promise<Association> = this.repository.findOneBy(idToFind);
        return filteredId;
    }

    public async getMembers(idToFind): Promise<User[]>{

       const userId = await this.repository.findOne({
            where: {id: Equal(idToFind)},
            select: ['users']
        });
        
        return userId ? userId.users : [] ;
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
