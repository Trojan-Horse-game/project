import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from "typeorm";

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

    
    friendship: any;

    
}
@Entity()
export class friendship {
 
    @ManyToOne(() => User, (user1: User) => user1.friendship)
    public user1_id: User | undefined;
    @ManyToOne(() => User, (user2: User) => user2.friendship)
    public user2_id: User | undefined;

    @Column()
    confirmed!:boolean;
}
