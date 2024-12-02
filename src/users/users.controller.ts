import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {

constructor(
	private service: UsersService
) {}

@Get('all')
getAll(): string[] {
	return ['a', 'b', 'c'];
	}

@Get()
getAllUsers(): User[] {
	return this.service.getAllUsers();
}


@Get(':id')
getById(@Param() parameter): User {
	const result = this.service.getById(+parameter.id);
	if (result === undefined){
		throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);
	}
	return result;
}


@Post()
create(@Body() input: any): User {
	return this.service.create(input.lastname, input.firstname, input.age);
}

@Put(':id')
putUser(@Param() parameter, @Body() input: any): User {
	const result = this.service.putUser(+parameter.id, input.lastname, input.firstname, input.age);
	if (result === undefined){
		throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);
	}
	return result;
}


@Delete(':id')
deleteUser(@Param() parameter): boolean{
	const result = this.service.deleteUser(+parameter.id);
	if (result === 1){
		throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);
	} else if (result === 2){
		throw new HttpException('Could not delete the user', HttpStatus.NOT_MODIFIED);
	}
	return true;
}

}
