import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Consultation } from "./consultation";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  sessionId!: string;

  @Column("decimal")
  invoiceValue!: number;

  @Column()
  customerName?: string;

  @Column()
  displayCurrencyIso?: string;

  @Column()
  mobileCountryCode?: string;

  @Column()
  customerMobile?: string;

  @Column()
  customerEmail?: string;

  @Column()
  callBackUrl?: string;

  @Column()
  errorUrl?: string;

  @Column("jsonb")
  invoiceItems: any; // Adjust type based on actual structure

  @Column()
  paymentURL?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToOne((type) => Consultation, (consultation) => consultation.payment)
  consultation!: Consultation;
}
