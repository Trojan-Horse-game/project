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

<<<<<<< HEAD
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
=======
    @ManyToOne ( ( )  =>  User ,  (user: any)  =>  User . friend_id ) 
    user : User | undefined ;
    static friend_id: any;
>>>>>>> ae83f5ca049ca4076fdbc3cd64c2df89bca87beb
}
