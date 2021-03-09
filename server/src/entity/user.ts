import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { Friendship } from "./friendship";

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

