import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Consultation } from "./consultation";

@Entity()
export class SOAP {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  subjective!: string; // Patient's subjective description (e.g., "Common cold")

  @Column("text")
  objective!: string; // Objective findings from the clinician (e.g., "NAD")

  @Column("text")
  assessment!: string; // Assessment or diagnosis code (e.g., "J00")

  @Column("text")
  plan!: string; // Treatment plan (e.g., "Sick leave for 1 day")

  @OneToOne(() => Consultation, (consultation) => consultation.soap)
  consultation!: Consultation;

  //dates
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  lastUpdatedAt?: Date;
}
