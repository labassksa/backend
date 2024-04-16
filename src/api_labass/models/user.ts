import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from "typeorm";
import { MarketerProfile } from "./marketer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number; //By using !, you're informing TypeScript that the id field will be populated
  //by some mechanism outside the constructor (in this case, by TypeORM when the entity is persisted).

  @Column({ unique: true, nullable: true })
  phoneNumber?: string; // Essential for registration/login

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ unique: true, nullable: true })
  nationalId?: string;

  @Column("date", { nullable: true })
  dateOfBirth?: Date;

  @Column({ default: "patient" })
  role!: string; // Default role as 'patient'

  @CreateDateColumn()
  createdAt: Date = new Date();

  @OneToOne(() => MarketerProfile, (marketerProfile) => marketerProfile.user, {
    nullable: true,
  })
  marketerProfile?: MarketerProfile;
}
