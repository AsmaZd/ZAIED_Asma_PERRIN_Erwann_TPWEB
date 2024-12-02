import { User } from "src/users/user.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Association{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    //public users: User[];
    public idUsers: number[];

    @Column()
    public name: string;

    constructor(
        id: number,
        idUsers: number[],
        name: string
    ){
        this.id = id;
        this.idUsers = idUsers;
        this.name = name;
    }
}