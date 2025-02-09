import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { MssqlParameter } from 'typeorm';
import { RoleInput } from './role.input';
import { User } from 'src/users/user.entity';
import { Association } from 'src/associations/association.entity';

@ApiTags('roles')
@Controller('roles')
export class RolesController {

    constructor(
        private service: RolesService
    ) {}

    //GET

    @ApiTags('gets')
    @Get()
    public async getAllRoles(): Promise <Role[]> {
        return this.service.getAllRoles();
    }

        
    @Get('users/:name')
    public async getUsersByRole(@Param() parameter): Promise<User[]>{
        const result = await this.service.getUsersByRole(parameter.name)

        if (result === null){
            throw new HttpException('Could not find a role with the id ${parameter1.id_user} or an association with the id ${parameter2.id_association)', HttpStatus.NOT_FOUND)
        }
        return result;
    }

    @Get('associations/:id')
    public async getAssociationsByUsers(@Param() parameter): Promise<{id: number, name: string, role: string}[]>{
        return this.service.getAssociationsByUser(+parameter.id)
    }

    @Get('associations/all/:id')
    public async getAssociationsByUserAll(@Param() parameter): Promise<{association_id: number, user_id: number, name: string, firstname: string, lastname: string, role: string}[]>{
        return this.service.getAssociationsByUserAll(+parameter.id)
    }

    @Get(':id_user/:id_association')
    public async getRole(@Param() parameter1, @Param() parameter2): Promise<Role>{
        const result = await this.service.getRole(+parameter1.id_user, +parameter2.id_association)
        if (result === null){
            throw new HttpException('Could not find a role with the id ${parameter1.id_user} or an association with the id ${parameter2.id_association)', HttpStatus.NOT_FOUND)
        }
        return result;
    }

    @Get(':id_user')
    public async getRoleByUser(@Param() parameter): Promise<Role[]>{
        const result = await this.service.getRoleByUser(+parameter)
        if (result === null){
            throw new HttpException('Could not find a role with the id ${parameter1.id_user} or an association with the id ${parameter2.id_association)', HttpStatus.NOT_FOUND)
        }
        return result;
    }
        

    //POST

    @ApiTags('posts')
	@ApiCreatedResponse({
		description: 'The role has been successfully created.'
	})

    @Post()
    public async create(@Body() input: RoleInput): Promise<Role>{
        return this.service.create(input.name, input.idUser, input.idAssociation); 
    }    
    
    //PUT

    @ApiTags('puts')
    @Put(':id_user/:id_association')
	public async putRole(@Param() parameter, @Body() input: RoleInput): Promise<Role> {
		const result = this.service.putRole(+parameter.id_user, +parameter.id_association, input.name);
		if (result === undefined){
			throw new HttpException('Could not find a role with the id ${parameter.id}', HttpStatus.NOT_FOUND);
		}
		return result;
	}

    //DELETE

    @ApiTags('deletes')
    @Delete(':id_user/:id_association')
	public async deleteRole(@Param() parameter): Promise<boolean>{
		const result = await this.service.deleteRole(+parameter.id_user, +parameter.id_association);
		if (result === 1){
			throw new HttpException('Could not find a role with the id ${parameter.id}', HttpStatus.NOT_FOUND);

		}
		return true;
		}
}
