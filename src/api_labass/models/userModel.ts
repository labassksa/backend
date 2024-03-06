import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  phoneNumber!: string;

  @Column()
  role: string = "Patient"; // 'patient', 'doctor', or 'admin'
}
