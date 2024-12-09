import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserInput } from './users.input';


@ApiTags('users')
@Controller('users')
export class UsersController {

constructor(
		private service: UsersService
	) {}

	@ApiTags('gets')
	@Get('all')
	public async getAll(): Promise<string[]> {
		return ['a', 'b', 'c'];
		}

	@ApiTags('gets')
	@Get()
	public async getAllUsers(): Promise<User[]> {
		return this.service.getAllUsers();
	}

	@ApiTags('gets')
	@Get(':id')
	public async getById(@Param() parameter): Promise<User> {
		const result = this.service.getById(+parameter.id);
		if (result === undefined){
			throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);
		}
		return result;
	}

	@ApiTags('posts')
	@ApiCreatedResponse({
		description: 'The user has been successfully created.'
	})
	@Post()
	public async create(@Body() input: UserInput): Promise<User> {
		return this.service.create(input.lastname, input.firstname, input.age, input.password);
	}

	@ApiTags('puts')
	@Put(':id')
	public async putUser(@Param() parameter, @Body() input: UserInput): Promise<User> {
		const result = this.service.putUser(+parameter.id, input.lastname, input.firstname, input.age, input.password);
		if (result === undefined){
			throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);
		}
		return result;
	}

	@ApiTags('deletes')
	@Delete(':id')
	public async deleteUser(@Param() parameter): Promise<boolean>{
		const result = await this.service.deleteUser(+parameter.id);
		if (result === 1){
			throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);

		}
		return true;
		}

}
