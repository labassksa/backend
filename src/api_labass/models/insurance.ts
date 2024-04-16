import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { PatientProfile } from "./patientProfile";

@Entity()
export class Insurance {
  @PrimaryGeneratedColumn()
  id!: number;

  // ...insurance-specific fields
  @Column()
  provider!: string; // The name of the insurance provider

  @Column({ unique: true })
  policyNumber!: string; // Unique policy number

  @Column()
  coverageDetails!: string; // Description of what the insurance covers

  @Column({ type: "date", nullable: true })
  expirationDate!: Date; // When the insurance policy expires

  @ManyToOne(() => PatientProfile, (patientProfile) => patientProfile.insurance)
  @JoinColumn()
  patientProfile!: PatientProfile;

  // ...additional fields and methods
}
