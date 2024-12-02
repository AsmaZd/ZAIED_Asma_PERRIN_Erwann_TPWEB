import { Injectable } from '@nestjs/common';
import { Association } from './association.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

const associations : Association[] = [
    {
        id: 0,
        idUsers: [0, 0],
        name: 'john au carré'
    }
]



let id: number = associations.length - 1;

@Injectable()
export class AssociationService {

    constructor(
        private service: UsersService
    ) {}

    //Get
    getAllAssociations(): Association[]{
        return associations;
    }

    getById(id): Association{
        let filteredId: Association[] = associations.filter((x) => x.id === id);
        return filteredId[0];
    }

    getMembers(id): User[]{
        let userId = (this.getById(id)).idUsers;
        //const ans : User[] = [this.service.getById(0)];
        const ans : User[] = userId.map(this.service.getById);
        console.log(this.service.getById(0));
        return ans;
    }

    //Post
    create(idUsers: number[], name: string): Association[]{
        id ++;
        let newAssociation: Association = new Association(id, idUsers, name);
        associations.push(newAssociation);
        return associations;
    }

    //Put
    putAssociation(id, idUsers: number[], name: string): Association{
        let filteredId: Association[] = associations.filter((x) => x.id === id);
        if (idUsers !== undefined){
            filteredId[0].idUsers = idUsers;
        }
        if (name !== undefined){
            filteredId[0].name = name;
        }
        return filteredId[0];
    }

    //Delete
    deleteAssociation(id): number{
        const index = associations.findIndex((x) => x.id === id);
        if (index === -1){
            return 1;
        }
        try {
            associations.splice(index, 1);
        } catch (error) {
            return 2;
        }
        return 0;
    }
}
