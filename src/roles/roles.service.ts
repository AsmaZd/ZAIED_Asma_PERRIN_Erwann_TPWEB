import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Equal, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Association } from 'src/associations/association.entity';
import { UsersService } from 'src/users/users.service';

let id: number = 0;

@Injectable()
export class RolesService {

    constructor(
        @InjectRepository(Role)
        private repository: Repository<Role>,
        @Inject(forwardRef(() => UsersService))
        private userService : UsersService
    ){}

    //Get
    public async getAllRoles(): Promise<Role[]>{
        return this.repository.find();
    }

    public async getRole(id_user: number, id_association: number): Promise<Role>{

        let filteredUser: Promise<Role> = this.repository.findOne({
            where: {
                id_user: id_user,
                id_association: id_association
            }
        })

        return filteredUser;
    }

    
    public async getRoleByUser(id_user: number): Promise<Role[]>{
        let filteredId: Promise<Role[]> = this.repository.find({
            where: { id_user: id_user}
        })
        return filteredId;
    }

    
    public async getUsersByRole(name: string): Promise<User[]>{
        const roles = await this.repository.find({
            where: { name: name}, 
            relations: ['user']
        });

        const users: User[] = roles.flatMap((role) => role.user );

        return users;
    }
        

    public async getAssociationsByUser(idToFind: number): Promise<{id: number, name: string, role: string}[]>{
        const roles = await this.repository.find({
            where: { id_user: idToFind },
            relations: ['association'],  
          });
      
          const associations = roles.map(role => ({
            id: role.association.id,
            name: role.association.name,
            role: role.name
          }));
      
          return associations;
    }

    public async getAssociationsByUserAll(idToFind: number): Promise<{association_id: number, user_id: number, name: string, firstname: string, lastname: string, role: string}[]>{
        const roles = await this.repository.find({
            where: { id_user: idToFind },
            relations: ['association'],  
          });
      
          const associations = roles.map(role => ({
            association_id: role.association.id,
            user_id: role.user.id,
            name: role.association.name,
            firstname: role.user.firstname,
            lastname: role.user.lastname,
            role: role.name
          }));
      
          return associations;
    }

    //Post
    public async create(name: string, id_user: number, id_association: number): Promise<Role> {

        const user = await this.userService.getById(id_user);
        const association= await this.repository.manager.getRepository(Association).findOne({where: {id: id_association} });

        let newRole = this.repository.create({
            id_user: id_user,
            id_association: id_association,
            name: name,
            user: user, 
            association: association, 
        })

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
