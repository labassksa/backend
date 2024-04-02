import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Consultation } from "./Consultation";

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn()
  sender!: User; // Identifies the sender of the message

  @Column("text")
  message!: string; // The text content of the message

  @Column({ nullable: true })
  attachmentUrl?: string; // URL to an attached file, image, or video

  @Column({ nullable: true })
  attachmentType?: string; // Type of attachment to handle different rendering (e.g., 'image', 'video', 'file')

  @ManyToOne(() => Consultation, (consultation) => consultation.chats)
  @JoinColumn()
  consultation!: Consultation; // Link to the consultation this message is part of

  @Column({ default: false })
  read!: boolean; // Indicates whether the message has been read

  @CreateDateColumn()
  createdAt!: Date; // Timestamp when the message was created
}
