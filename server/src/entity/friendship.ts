import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from "typeorm";
import { User } from "./user";

@Entity()
@Unique(["user1_id", "user2_id"])
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.id)
  @Column()
  user1_id: number;

  @ManyToOne(() => User, (user: User) => user.id)
  @Column()
  user2_id: number;

  @Column({ default: "pending" })
  status: string;
}
