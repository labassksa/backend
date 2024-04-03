import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { DoctorProfile } from "./DoctorProfile";
import { PatientProfile } from "./PatientProfile";
import { ConsultationType } from "../../types/consultation_types";
import { ConsultationStatus } from "../../types/consultationstatus";
import { Prescription } from "./Prescription";
import { SOAP } from "./Soap";
import { SickLeave } from "./SickLeave";
import { ChatMessage } from "./ChatMessage";

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
  doctor?: DoctorProfile;

  //dates
  @CreateDateColumn()
  createdAt: Date = new Date();

  @Column({ type: "timestamp", nullable: true })
  doctorJoinedAT?: Date;

  @Column({ type: "timestamp", nullable: true })
  patientJoinedAT?: Date;

  @Column({ type: "timestamp", nullable: true })
  patientPaidAT?: Date;

  @Column({ type: "timestamp", nullable: true })
  closedAt?: Date;

  @Column({
    type: "enum",
    enum: ConsultationType,
    default: ConsultationType.Quick,
  })
  type!: ConsultationType;

  // Chats are tied to consultations, not users
  @OneToMany((type) => ChatMessage, (chat) => chat.consultation)
  chats?: ChatMessage[];

  // One-to-one relations to other consultation details
  @OneToOne((type) => Prescription, { cascade: true, nullable: true })
  @JoinColumn()
  prescription?: Prescription;

  @Column({
    type: "enum",
    enum: ConsultationStatus,
    default: ConsultationStatus.PendingPayment,
  })
  status: ConsultationStatus = ConsultationStatus.PendingPayment;

  @OneToOne((type) => SOAP, { cascade: true, nullable: true })
  @JoinColumn()
  soap?: SOAP;

  @OneToOne((type) => SickLeave, { cascade: true, nullable: true })
  @JoinColumn()
  sickLeave?: SickLeave;
}
