import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Consultation } from "./consultation";
import { User } from "./user";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((type) => User)
  sender!: User;

  @ManyToOne((type) => User)
  receiver!: User;

  @ManyToOne((type) => Consultation, (consultation) => consultation.chats)
  consultation!: Consultation;

  @Column("text")
  message!: string;

  @Column()
  read: boolean = false; // Default to false, indicating not read

  @CreateDateColumn()
  createdAt: Date = new Date();
}
