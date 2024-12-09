import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

let id: number = 0;

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ){}

    //Get
    public async getAllUsers(): Promise<User[]> {
        return this.repository.find();
    }

    public async getById(idToFind : number): Promise<User> {
        let filteredId: Promise<User> = this.repository.findOneBy({id: Equal(idToFind)});
        return filteredId;
    }

    //Post
    public async create(lastname: string, firstname: string, age: number, password: string): Promise<User> {
        id ++; 
        let newUser = this.repository.create({
            id: id, 
            firstname: firstname, 
            lastname: lastname, 
            age: age, 
            password: password
        })
        await this.repository.save(newUser);
        return newUser;
    }

    //Put
    public async putUser(idToFind, lastname: string, firstname: string, age: number, password: string): Promise<User> {
        //let filteredId: Promise<User> = this.repository.findOneBy({id: Equal(idToFind)});
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
            filteredId.password = password;
        }
        await this.repository.save(filteredId);
        return filteredId;
    }

    //Delete
    public async deleteUser(idToFind): Promise<number>{
        const index = await this.repository.findOneBy({id: idToFind});
        //const index = users.findIndex((x) => x.id === idToFind);
        if (!index){
            return 1;
        }
        await this.repository.delete(idToFind);
        return 0;
    }

    
}


