import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

const users : User[] = [
	{
		id: 0,
		lastname: 'Doe',
		firstname: 'John',
		age: 23
	}
]

let id: number = users.length - 1;

@Injectable()
export class UsersService {

    //Get
    getAllUsers(): User[] {
        return users;
    }

    getById(id : number): User {
        let filteredId: User[] = users.filter((x) => x.id === id);
        console.log(id);
        return filteredId[0];
    }

    //Post
    create(lastname: string, firstname: string, age: number): User {
        id ++; 
        let newUser: User = new User(id, firstname, lastname, age);
        users.push(newUser);
        return newUser;
    }

    //Put
    putUser(id, lastname: string, firstname: string, age: number): User {
	let filteredId: User[] = users.filter((x) => x.id === id);
	if (firstname !== undefined){
		filteredId[0].firstname = firstname;
	}
	if (lastname !== undefined){
		filteredId[0].lastname = lastname;
	}
    if (age !== undefined){
        filteredId[0].age = age;
    }
	return filteredId[0];
    }

    //Delete
    deleteUser(id): number{
        const index = users.findIndex((x) => x.id === id);
        if (index === -1){
            return 1;
        }
        try {
            users.splice(index, 1);
        } catch (error) {
            //throw new HttpException('Could not delete the user', HttpStatus.NOT_MODIFIED);
            return 2;
        }
        return 0;
    }

    
}


