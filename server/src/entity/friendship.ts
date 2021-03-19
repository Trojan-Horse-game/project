import {Entity, Column, PrimaryGeneratedColumn,ManyToOne, OneToMany, JoinColumn} from "typeorm";
import { User } from "../entity/user";

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id!: number;

  @JoinColumn()
  user1_id!: User;

  @JoinColumn()
  user2_id!: User;

  @Column()
  confirmed!: boolean;
}
