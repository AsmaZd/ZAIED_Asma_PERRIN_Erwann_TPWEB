import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/role.entity';
import { RolesService } from 'src/roles/roles.service';

let id: number = 0;

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
        @Inject(forwardRef(() => RolesService))
        private roleService : RolesService
    ){}

    //Get
    public async getAllUsers(): Promise<User[]> {
        return this.repository.find();
    }

    public async getById(idToFind : number): Promise<User> {
        let filteredId: Promise<User> = this.repository.findOneBy({id: Equal(idToFind)});
        return filteredId;
    }

    public async getRoles(idToFind: number): Promise<string[]> {
        const userRoles = this.roleService.getRoleByUser(idToFind)
        const listRoles = (await userRoles).map(role => role.name)
        return listRoles;
    }

    //Post
    public async create(lastname: string, firstname: string, age: number, password: string): Promise<User> {
        id ++;

        let hash = undefined;
        if (password !== undefined){
            const saltOrRounds = 10;
            hash = await bcrypt.hash(password, saltOrRounds);
        }

        let newUser = this.repository.create({
            id: id, 
            firstname: firstname, 
            lastname: lastname, 
            age: age, 
            password: hash
        })
        await this.repository.save(newUser);
        return newUser;
    }

    //Put
    public async putUser(idToFind, lastname: string, firstname: string, age: number, password: string): Promise<User> {

        let filteredId: User = await this.getById(idToFind);
        if (firstname !== undefined){
            filteredId.firstname = firstname;
        }
        if (lastname !== undefined){
            filteredId.lastname = lastname;
        }
        if (age !== undefined){
            filteredId.age = age;
        }
        if (password !== undefined){
            const saltOrRounds = 10;
            const hash = await bcrypt.hash(password, saltOrRounds);
            filteredId.password = hash;
        }
        await this.repository.save(filteredId);
        return filteredId;
    }

    //Delete
    public async deleteUser(idToFind): Promise<number>{
        const index = await this.repository.findOneBy({id: idToFind});

        if (!index){
            return 1;
        }
        await this.repository.delete(idToFind);
        return 0;
    }

    
}


