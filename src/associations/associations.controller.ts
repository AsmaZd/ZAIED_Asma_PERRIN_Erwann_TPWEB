import { Controller, Param, Body, Get, Post, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { Association } from './association.entity';
import { AssociationService } from './associations.service';
import { User } from 'src/users/user.entity';

@Controller('associations')
export class AssociationsController {

    constructor(
        private service: AssociationService
    ){}

    @Get()
    getAllAssociations(): Association[]{
        return this.service.getAllAssociations();
    }

    @Get(':id')
    getById(@Param() parameter): Association{
        const result = this.service.getById(+parameter.id);
        if (result === undefined){
            throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    @Get(':id/members')
    getMembers(@Param() parameter): User[]{
        const result = this.service.getMembers(+parameter.id);
        if (result === undefined){
            throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND)
        }
        return result;
    }

    @Post()
    create(@Body() input: any): Association[]{
        return this.service.create((input.idUsers.map(Number)), input.name);
    }

    @Put(':id')
    putAssociation(@Param() parameter, @Body() input: any): Association{
        const result = this.service.putAssociation(+parameter.id, (input.idUsers.map(Number)), input.name);
        if (result === undefined){
            throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    @Delete(':id')
    deleteAssociation(@Param() parameter): boolean{
        const result = this.service.deleteAssociation(+parameter.id);
        if (result === 1){
            throw new HttpException('Could not find a user with the id ${parameter.id}', HttpStatus.NOT_FOUND);
        } else if (result === 2){
            throw new HttpException('Could not delete the user', HttpStatus.NOT_MODIFIED);
        }
        return true;
    }

    

}
