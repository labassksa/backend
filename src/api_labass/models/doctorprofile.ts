import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Consultation } from "./consultation";
import { User } from "./user";

@Entity()
export class DoctorProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  specialty!: string;
  @Column()
  medicalLiscenceNumber!: string;

  @OneToOne((type) => User)
  @JoinColumn()
  user!: User; // Relate to the User model

  // Relationship to consultations
  @OneToMany((type) => Consultation, (consultation) => consultation.doctor)
  consultations?: Consultation[];
}
