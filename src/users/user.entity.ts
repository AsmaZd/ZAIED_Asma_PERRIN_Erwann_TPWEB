import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public lastname: string;

    @Column()
    public firstname: string;

    @Column()
    public age: number;

    @Column()
    public password: string;

    constructor(
        id: number,
        lastname: string,
        firstname: string,
        age: number
    ) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
    }
}