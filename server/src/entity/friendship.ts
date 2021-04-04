import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { User } from "../entity/user";

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id_friendship: number;

  //@ManyToOne(() => User, (user) => user.id)
  @Column()
  user1_id!: number;

  // @ManyToOne(() => User, (user) => user.id)
  @Column()
  user2_id: number;

  @Column()
  confirmed!: number;
}
