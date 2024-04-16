import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Consultation } from "./consultation";
import { User } from "./user";

@Entity()
export class DoctorProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  specialty!: string;

  @Column({ nullable: true })
  iban?: string; // Marketer's IBAN for financial transactions

  @Column()
  medicalLicenseNumber!: string;

  @OneToOne((type) => User)
  @JoinColumn()
  user!: User; // Relate to the User model

  // // Online/Offline status
  // @Column({ default: false })
  // isOnline!: boolean;

  // @UpdateDateColumn()
  // lastOnlineAt!: Date; // Tracks when the doctor was last set as online

  // @UpdateDateColumn()
  // lastOfflineAt!: Date; // Tracks when the doctor was last set as offline
  // Relationship to consultations
  @OneToMany((type) => Consultation, (consultation) => consultation.doctor)
  consultations?: Consultation[];
}
