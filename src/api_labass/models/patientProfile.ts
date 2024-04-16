import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Consultation } from "./consultation";
import { Insurance } from "./insurance";

@Entity()
export class PatientProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Insurance, (insurance) => insurance.patientProfile, {
    nullable: true,
  })
  insurance?: Insurance[]; // Insurance is optional, defaulting to null

  @OneToOne((type) => User)
  @JoinColumn()
  user!: User; // Relate to the User model

  // @Column({ nullable: true })
  // guardianId?: number; // ID of the guardian's PatientProfile, if this profile is for a dependent

  @OneToMany(() => PatientProfile, (dependent) => dependent.guardian, {
    nullable: true,
  })
  dependents?: PatientProfile[];

  @ManyToOne(
    () => PatientProfile,
    (patientProfile) => patientProfile.dependents,
    { nullable: true }
  )
  @JoinColumn({ name: "guardianId" }) // This explicitly names the foreign key column
  guardian?: PatientProfile;

  // Relationships to consultations and prescriptions
  @OneToMany((type) => Consultation, (consultation) => consultation.patient, {
    nullable: true,
  })
  consultations?: Consultation[];
}
