import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Consultation } from "./consultation";

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

  //dates
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  lastUpdatedAt?: Date;
  // Other necessary fields like issuedOn date can be inferred from consultation details
}
