import { Association } from "src/associations/association.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role{
    @PrimaryColumn()
    public id_user: number;

    @PrimaryColumn()
    public id_association: number;

    @Column()
    public name: string;
    
    @ManyToOne(type => User, {eager: true})
    @JoinColumn({ name: 'id_user'})
    public user: User;

    @ManyToOne(type => Association, {eager: true, onDelete: 'CASCADE'})
    @JoinColumn({ name: 'id_association'})
    public association: Association;

    /*
    constructor(
        name: string,
        o_user: User,
        o_association: Association
    ){
        //let id: number = o_association.getId()
        this.name = name,
        this.user = o_user,
        this.association = o_association,
        this.id_user = o_user.id,
        this.id_association = o_association.id
    }
        */
    
}