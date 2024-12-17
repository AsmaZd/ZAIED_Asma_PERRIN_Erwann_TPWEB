import { User } from "src/users/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Association{
    @PrimaryGeneratedColumn()
    public id: number;

    //@Column()
   // public users: User[];
    //public idUsers: number[];

    @Column()
    public name: string;

    @ManyToMany(type => User, { eager: true})
    @JoinTable()
    users: User[];

    //plus utile
    constructor(
        id: number,
        users: User[],
        name: string
    ){
        this.id = id;
        this.users = users;
        this.name = name;
    }

    /*
    getId(){
        return this.id;
    }*/
}