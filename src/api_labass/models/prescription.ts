import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { Consultation } from "./Consultation";

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Consultation, (consultation) => consultation.prescription)
  consultation!: Consultation;

  //Drug
  @Column()
  drugName!: string;

  @Column({ nullable: true })
  activeIngredient?: string; // Optional

  @Column()
  strength!: string; // Required

  @Column()
  pharmaceuticalForm!: string; // Required

  @Column()
  dose!: string; // Required

  @Column()
  doseUnit?: string;

  @Column()
  registrationNo!: string;

  @Column()
  route!: string; // e.g., Oral

  @Column()
  frequency!: string; // e.g., Every 6 hours

  @Column()
  indications?: string;

  @Column()
  duration!: string; // e.g., 1 

  @Column()
  durationUnit!: string;

  @Column({ default: false })
  prn!: boolean; // true if 'as needed', otherwise false

  
  // Diagnosis field
  @Column("text", { array: true, default: () => "array[]::text[]" },)
  diagnoses: string[] = [];

  // allergies field
  @Column("text", { array: true, default: () => "array[]::text[]" },)
  allergies: string[] = [];

  //dates
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Additional fields like primary diagnosis, secondary diagnosis, etc., can be added as needed.
}
