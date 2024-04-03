import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { Consultation } from "./Consultation";

@Entity()
export class SickLeave {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Consultation)
  consultation!: Consultation; // Direct link to the consultation, accessing patient and doctor details through it

  @Column("date")
  startDate!: Date; // Start date of the sick leave

  @Column("date")
  endDate!: Date; // End date of the sick leave

  @Column("text", { nullable: true })
  diagnosis!: string; // Diagnosis or reason for sick leave, optional for flexibility

  // Other necessary fields like issuedOn date can be inferred from consultation details
}
