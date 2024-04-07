import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { PromotionalCode } from "./PromotionalCode";
import { User } from "./User";

@Entity()
export class MarketerProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  iban?: string; // Marketer's IBAN for financial transactions

  @Column({ nullable: true })
  organizationIban?: string; // Marketer organization's IBAN

  @Column({ nullable: true })
  organizationName?: string; // Name of the marketer's organization

  @OneToOne(() => User, (user) => user.marketerProfile)
  @JoinColumn()
  user!: User;

  // Link to promotional codes created for this marketer
  @OneToMany(() => PromotionalCode, (promoCode) => promoCode.marketerProfile)
  promotionalCodes?: PromotionalCode[];
}
