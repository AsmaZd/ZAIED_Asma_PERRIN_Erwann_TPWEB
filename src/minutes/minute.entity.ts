import { Association } from "src/associations/association.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Minute{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public date: string;

    @Column()
    public content: string;

    @ManyToMany(type => User, {eager: true})
    @JoinTable()
    public user: User[];

    @ManyToOne(type => Association, {eager: true})
    public association: Association;

}