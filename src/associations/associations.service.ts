import { Injectable } from '@nestjs/common';
import { Association } from './association.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

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
        //let filteredId: Association[] = associations.filter((x) => x.id === idToFind);
        let filteredId: Promise<Association> = this.repository.findOneBy(idToFind);
        return filteredId;
    }

    public async getMembers(idToFind): Promise<User[]>{
        /*
        //let userId = await this.getById(idToFind).users;
        const userId = await this.repository.findOne({
            where: {id: Equal(idToFind)},
            select: ['users']
        });
        //let userId = (this.getById(idToFind)).idUsers;
        //const ans : User[] = [this.service.getById(0)];
        //const ans : User[] = userId.map(this.service.getById);
        const members = await Promise.all(userId.users.map(async (usId: number) => {
            return this.service.getById(usId);
        }));
        //console.log(this.service.getById(0));
        */
       const userId = await this.repository.findOne({
            where: {id: Equal(idToFind)},
            select: ['users']
        });
        
        return userId ? userId.users : [] ;
    }

    //Post
    public async create(users: User[], name: string): Promise<Association>{
        id ++;
        const newAssociation = this.repository.create({
            id: id,
            users: users,
            name: name
        })
        await this.repository.save(newAssociation);
        //let newAssociation: Association = new Association(id, idUsers, name);
        //associations.push(newAssociation);
        return newAssociation;
    }

    //Put
    public async putAssociation(idToFind, idUsers: User[], name: string): Promise<Association>{
        let filteredId : Association = await this.repository.findOneBy(idToFind); 
        //let filteredId: Association[] = associations.filter((x) => x.id === idToFind);
        if (idUsers !== undefined){
            filteredId.users = idUsers;
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
        //const index = associations.findIndex((x) => x.id === idToFind);
        if (!index){
            return 1;
        }
        /*
        try {
            associations.splice(index, 1);
        } catch (error) {
            return 2;
        }
            */
        return 0;
    }
}
