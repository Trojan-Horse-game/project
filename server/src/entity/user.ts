import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    // TODO : Complete the User model 

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    password!: string;

}
