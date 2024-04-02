import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Consultation } from "./Consultation";

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Consultation, (consultation) => consultation.prescription)
  consultation!: Consultation;

  @Column()
  drugName!: string;

  @Column()
  registrationNo!: string;

  @Column()
  doseUnit!: string;

  @Column()
  route!: string; // e.g., Oral

  @Column()
  frequency!: string; // e.g., Every 6 hours

  @Column()
  indications!: string;

  @Column()
  duration!: string; // e.g., 1 Week

  @Column({ default: false })
  prn!: boolean; // true if 'as needed', otherwise false

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Additional fields like primary diagnosis, secondary diagnosis, etc., can be added as needed.
}
