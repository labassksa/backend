import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { MarketerProfile } from "./marketer";
@Entity()
export class PromotionalCode {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column()
  usageCount!: number; // Number of times the code was used

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  discountPercentage!: number; // Discount percentage offered by the code

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  marketerPercentage!: number; // Percentage of revenue going to the marketer

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  marketerOrganizationPercentage?: number; // Percentage of revenue going to the marketer's organization

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  totalRevenueGenerated!: number; // Total revenue generated by the code

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(
    () => MarketerProfile,
    (marketerProfile) => marketerProfile.promotionalCodes
  )
  marketerProfile!: MarketerProfile;

  //   // Methods to calculate the shares of revenue
  //   getMarketerIncome(): number {
  //     return parseFloat((this.totalRevenueGenerated * (this.marketerPercentage / 100)).toFixed(2));
  //   }

  //   getMarketerOrganizationIncome(): number {
  //     return parseFloat((this.totalRevenueGenerated * (this.marketerOrganizationPercentage / 100)).toFixed(2));
  //   }

  //   // Assuming the remaining revenue goes to your income
  //   getOurIncome(): number {
  //     const totalPercentage = this.marketerPercentage + this.marketerOrganizationPercentage;
  //     const ourPercentage = 100 - totalPercentage;
  //     return parseFloat((this.totalRevenueGenerated * (ourPercentage / 100)).toFixed(2));
  //   }
}
