import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Minute } from './minute.entity';
import { Equal, In, Repository } from 'typeorm';
import { Association } from 'src/associations/association.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class MinutesService {

    constructor(
        @InjectRepository(Minute)
        private repository: Repository<Minute>
    ){}

    public async getAllMinutes(): Promise<Minute[]>{
        return this.repository.find();
    }


    public async getMinute(idToFind: number): Promise<Minute>{
        let filteredMinute: Promise<Minute> = this.repository.findOneBy({
            id: Equal(idToFind)
        })
        return filteredMinute;
    }

    //Get

    public async getByAssociation(id_association: number): Promise<Minute[]>{
        let filteredMinute: Promise<Minute[]> = this.repository.find({
            where: {
                association: {id: id_association}
            },
            relations: ['association'],
        });
        return filteredMinute;
    }


    //Post
    public async create(content: string, idVoters: number[], date: string, idAssociation: number): Promise<Minute> {

        //const users = await this.repository.manager.getRepository(User).findBy({ id: In(idVoters) });
        console.log('halo')
        const association = await this.repository.manager.getRepository(Association).findOne({
            where: {id: idAssociation},
            relations: ['users'],
        });
        console.log('associtaion')
        console.log(association)
        const assUsersId = association.users.map(user => user.id)
        console.log('assurid')
        console.log(assUsersId)
        const invalidVoters = idVoters.filter(voterId => !assUsersId.includes(Number(voterId)));
        if (invalidVoters.length > 0) {
            console.log(invalidVoters)
            return undefined
        }
        console.log('eeet la')

        const users = await this.repository.manager.getRepository(User).findBy({ id: In(idVoters) });


        let newMinute = this.repository.create({
            date: date,
            content: content,
            user: users, 
            association: association, 
        })

        console.log('je creer une minute ')
        console.log(newMinute)
        await this.repository.save(newMinute);
        return newMinute;
    }



    //Put
    public async putMinute(id: number, content: string, idVoters: number[], date: string, idAssociation: number): Promise<Minute> {

        let filteredId: Minute = await this.getMinute(id);
        if (content !== undefined){
            filteredId.content = content;
        }
        if (date !== undefined){
            filteredId.date = date;
        }
        if (idVoters !== undefined){

            const users = await this.repository.manager.getRepository(User).findBy({ id: In(idVoters) });

            const assUsersId = filteredId.association.users.map(user => user.id)
            const invalidVoters = idVoters.filter(voterId => !assUsersId.includes(voterId));
            if (invalidVoters.length > 0) {
                return undefined
            }

            filteredId.user = users;
        }
        if (idAssociation !== undefined){
            const association = await this.repository.manager.getRepository(Association).findOne({where: {id: idAssociation} });

            filteredId.association = association
        }

        await this.repository.save(filteredId);
        return filteredId;
    }


    //Delete
    public async deleteMinute(idToFind): Promise<number>{
        const index = await this.repository.findOneBy({id: idToFind});
        if (!index){
            return 1;
        }
        await this.repository.delete(idToFind);
        return 0;
    }


}
