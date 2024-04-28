import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  senderId!: number; // ID of the sender, assumed to link to a User entity

  @Column()
  receiverId!: number; // ID of the receiver, also linking to a User entity

  @Column()
  consultationId!: number; // Directly use only the consultation ID

  @Column("text") //"text": This specifies the type of the column in the database. In SQL databases, text is a column type that can store strings of any length. It is often used for large pieces of text like articles, comments, descriptions, etc., where the length can exceed the limits of a varchar type.
  message!: string;

  @Column({ nullable: true })
  attachmentUrl?: string;

  @Column({ nullable: true })
  attachmentType?: string;

  @Column({ default: false })
  read!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
