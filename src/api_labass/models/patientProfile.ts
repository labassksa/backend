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
  @OneToOne(() => Insurance, (insurance) => insurance.patientProfile, {
    nullable: true,
  })
  insurance?: Insurance; // Insurance is optional, defaulting to null

  @OneToOne((type) => User)
  @JoinColumn()
  user?: User; // Relate to the User model

  @Column({ nullable: true })
  guardianId?: number; // ID of the guardian's PatientProfile, if this profile is for a dependent

  @OneToMany(() => PatientProfile, (dependent) => dependent.guardian, {
    nullable: true,
  })
  dependents?: PatientProfile[];

  @ManyToOne(() => PatientProfile, (guardian) => guardian.dependents, {
    nullable: true,
  })
  guardian?: PatientProfile;

  // Relationships to consultations and prescriptions
  @OneToMany((type) => Consultation, (consultation) => consultation.patient)
  consultations?: Consultation[];
}
