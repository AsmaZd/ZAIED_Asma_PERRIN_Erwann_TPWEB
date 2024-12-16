import { Controller, Param, Body, Get, Post, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { Association } from './association.entity';
import { AssociationService } from './associations.service';
import { User } from 'src/users/user.entity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AssociationInput } from './associations.input';

@ApiTags('associations')
@Controller('associations')
export class AssociationsController {

    constructor(
        private service: AssociationService
    ){}

    @ApiTags('gets')
    @Get()
    public async getAllAssociations(): Promise<Association[]>{
        return this.service.getAllAssociations();
    }

    @ApiTags('gets')
    @Get(':id')
    public async getById(@Param() parameter): Promise<Association>{
        const result = this.service.getById(+parameter.id);
        if (result === undefined){
            throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    @ApiTags('gets')
    @Get(':id/members')
    public async getMembers(@Param() parameter): Promise<User[]>{
        const result = this.service.getMembers(+parameter.id);
        if (result === undefined){
            throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND)
        }
        return result;
    }

    @ApiTags('posts')
    @ApiCreatedResponse({
        description: 'The association has been successfully created.'
    })
    @Post()
    public async create(@Body() input: AssociationInput): Promise<Association>{
        return this.service.create(input.users, input.name);
    }

    @ApiTags('puts')
    @Put(':id')
    public async putAssociation(@Param() parameter, @Body() input: AssociationInput): Promise<Association>{
        const result = this.service.putAssociation(+parameter.id, input.users, input.name);
        if (result === undefined){
            throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    @ApiTags('deletes')
    @Delete(':id')
    public async deleteAssociation(@Param() parameter): Promise<boolean>{
        const result = await this.service.deleteAssociation(+parameter.id);
        if (result === 1){
            throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);

        }
        return true;
    }

    

}
