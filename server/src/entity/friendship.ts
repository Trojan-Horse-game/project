import {Entity, Column, ManyToOne} from "typeorm";
import { User } from "../entity/user";
@Entity()
export class friendship {
 
    @ManyToOne(() => User, (user1: User) => user1.friendship)
    public user1_id: User | undefined;
    @ManyToOne(() => User, (user2: User) => user2.friendship)
    public user2_id: User | undefined;

    @Column()
    confirmed!:boolean;
}