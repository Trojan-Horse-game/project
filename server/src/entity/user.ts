import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  username: string;

  @Column()
  password: string;

  @Column({default:0})
  games: number;

  @Column({default:0})
  wins: number;
}

