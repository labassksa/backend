import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";
//This model is to store the OTP code in the SQLite db for user verification
@Entity()
export class OTPModel {
  @PrimaryColumn("varchar") // Explicitly set to 'varchar' for SQLite compatibility
  phoneNumber!: string;

  @Column({
    type: "varchar", // Explicitly defining the code column type as 'varchar'
    length: 255, // This length is optional; SQLite doesn't enforce it
  })
  code!: string;

  @Column("integer", {
    // Use 'integer' type for timestamps in SQLite
    transformer: {
      // Custom transformer to handle Date to integer conversion and vice versa
      to: (value: Date) => value.getTime(), // When saving to the database, convert Date to UNIX timestamp
      from: (value: number) => new Date(value), // When reading from the database, convert UNIX timestamp to Date
    },
  })
  expiry!: Date;
}
