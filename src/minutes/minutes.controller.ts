import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { MinutesService } from './minutes.service';
import { Minute } from './minute.entity';
import { MinuteInput } from './minute.input';

@ApiTags('minutes')
@Controller('minutes')
export class MinutesController {


    constructor(
        private service: MinutesService
    ) {}

    //GET

    @ApiTags('gets')
    @Get()
    public async getAllMinutes():Promise<Minute[]> {
        return this.service.getAllMinutes();
    }

    @Get(':id')
    public async getMinute(@Param() parameter): Promise<Minute>{
        const result = await this.service.getMinute(+parameter.id)
        if (result === null){
            throw new HttpException('Could not find a minute with the id ${parameter.id}', HttpStatus.NOT_FOUND)
        }
        return result;
    }

    @Get(':id_association/association')
    public async getByAssociation(@Param() parameter): Promise<Minute[]>{
        const result = await this.service.getByAssociation(+parameter.id_association)
        if (result === null){
            throw new HttpException('Could not find a minute with the id ${parameter.id}', HttpStatus.NOT_FOUND)
        }
        return result;
    }

    //POST

    @ApiTags('posts')
    @ApiCreatedResponse({
        description: 'The minute has been successfully created.'
    })

    @Post()
    public async create(@Body() input: MinuteInput): Promise<Minute>{
        return this.service.create(input.content, input.idVoters, input.date, input.idAssociation); 
    } 

    //PUT

    @ApiTags('puts')
    @Put(':id')
    public async putMinute(@Param() parameter, @Body() input: MinuteInput): Promise<Minute> {
        const result = this.service.putMinute(+parameter.id, input.content, input.idVoters, input.date, input.idAssociation);
        if (result === undefined){
            throw new HttpException('Could not find a minute with the id ${parameter.id}', HttpStatus.NOT_FOUND);
        }
        return result;
    }
    
    //DELETE

    @ApiTags('deletes')
    @Delete(':id')
	public async deleteMinute(@Param() parameter): Promise<boolean>{
		const result = await this.service.deleteMinute(+parameter.id);
		if (result === 1){
			throw new HttpException('Could not find a minute with the id ${parameter.id}', HttpStatus.NOT_FOUND);

		}
		return true;
		}

}
