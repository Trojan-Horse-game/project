import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";

@Entity()
export class User {
 

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    password!: string;

    @Column()
    games!: number;

    @Column()    
    wins!: number;

    @ManyToOne ( ( )  =>  User ,  (user: any)  =>  User . friend_id ) 
    user : User | undefined ;
    static friend_id: any;
}
