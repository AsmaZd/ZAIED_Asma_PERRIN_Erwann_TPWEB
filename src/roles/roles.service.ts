import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Equal, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Association } from 'src/associations/association.entity';

let id: number = 0;

@Injectable()
export class RolesService {

    constructor(
        @InjectRepository(Role)
        private repository: Repository<Role>
    ){}

    //Get
    public async getAllRoles(): Promise<Role[]>{
        return this.repository.find();
    }

    /*
    public async getById(idToFind): Promise<Role>{
        let filteredId: Promise<Role> = this.repository.findOneBy({id: Equal(idToFind)});
        return filteredId;
    }
    */

    public async getRole(id_user: number, id_association: number): Promise<Role>{
        console.log(id_user)
        console.log(id_association)
        let filteredUser: Promise<Role> = this.repository.findOne({
            where: {
                id_user: id_user,
                id_association: id_association
            }
        })
        console.log("salut")
        console.log(filteredUser)
        return filteredUser;
    }

    //Post
    public async create(name: string, id_user: number, id_association: number): Promise<Role> {
        console.log(name)
        console.log(id_user)
        console.log(id_association)
        //id ++;
        const user = await this.repository.manager.getRepository(User).findOne({where: {id: id_user} });
        const association= await this.repository.manager.getRepository(Association).findOne({where: {id: id_association} });
        console.log(user)
        console.log(association)


        let newRole = this.repository.create({
            //id: id, 
            id_user: id_user,
            id_association: id_association,
            name: name,
            user: user, 
            association: association, 
        })

        console.log(newRole)
        await this.repository.save(newRole);
        return newRole;
    }

    //Put
    public async putRole(id_user: number, id_association: number, name: string): Promise<Role> {

        let filteredId: Role = await this.getRole(id_user, id_association);
        if (name!== undefined){
            filteredId.name = name;
        }
        await this.repository.save(filteredId);
        return filteredId;
    }

    //Delete
    public async deleteRole(id_user, id_association): Promise<number>{
        const index = await this.repository.findOne({where: {
            id_user: id_user,
            id_association: id_association
            }
        });
        if (!index){
            return 1;
        }
        await this.repository.delete({id_user, id_association});
        return 0;
    }
}
