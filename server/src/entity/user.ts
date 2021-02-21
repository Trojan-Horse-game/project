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

    @ManyToOne(() => friendship)
    @JoinColumn()
    friendship: friendship | undefined;  

}
@Entity()
export class friendship {
 

    @Column()
   public user_id1!: number;

    @Column()
    user_id2!:number;

    @Column()
    confirmed!:boolean;
}
