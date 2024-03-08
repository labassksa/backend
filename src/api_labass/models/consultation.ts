import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { DoctorProfile } from "./doctorprofile";
import { PatientProfile } from "./patientProfile";
import { ConsultationType } from "../../types/consultation_types";
import { ConsultationStatus } from "../../types/consultationstatus";
import { Prescription } from "./prescription";
import { SOAP } from "./soap";
import { SickLeave } from "./sickleave";
import { Chat } from "./chat";

@Entity()
export class Consultation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    (type) => PatientProfile,
    (patientProfile) => patientProfile.consultations
  )
  patient!: PatientProfile;

  @ManyToOne(
    (type) => DoctorProfile,
    (doctorProfile) => doctorProfile.consultations
  )
  doctor!: DoctorProfile;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({
    type: "enum",
    enum: ConsultationType,
    default: ConsultationType.Quick,
  })
  type!: ConsultationType;

  // Chats are tied to consultations, not users
  @OneToMany((type) => Chat, (chat) => chat.consultation)
  chats!: Chat[];

  // One-to-one relations to other consultation details
  @OneToOne((type) => Prescription)
  @JoinColumn()
  prescription!: Prescription;

  @Column({
    type: "enum",
    enum: ConsultationStatus,
    default: ConsultationStatus.New,
  })
  status: ConsultationStatus = ConsultationStatus.New;

  @OneToOne((type) => SOAP)
  @JoinColumn()
  soap!: SOAP;

  @OneToOne((type) => SickLeave)
  @JoinColumn()
  sickLeave!: SickLeave;
}
