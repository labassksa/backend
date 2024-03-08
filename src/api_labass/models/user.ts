import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // Auto-initialized by TypeORM, no need for manual initialization

  @Column({ unique: true })
  phoneNumber: string = ""; // Initialize with an empty string if not provided immediately
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;
  @Column()
  email!: string; // Mark as optional if it can be null

  @Column()
  gender!: string; // Mark as optional if it can be null

  @Column()
  nationalId!: string; // Mark as optional if it can be null

  @Column("date")
  dateOfBirth!: Date; // Mark as optional if it can be null

  @Column()
  role: string = "patient"; // Provide a default role, assuming 'patient' as the most common

  @CreateDateColumn()
  createdAt: Date = new Date(); // Default to current date/time, auto-managed by TypeORM
}
