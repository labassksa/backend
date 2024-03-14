import { DataSource } from "typeorm";
import { config as dotenvConfig } from "dotenv";

// Load the correct .env file based on NODE_ENV
dotenvConfig({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

export const AppDataSource: DataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === "true", // Use cautiously in production
  logging: process.env.TYPEORM_LOGGING === "true",
  entities: [
    process.env.NODE_ENV === "production"
      ? "dist/api_labass/models/**/*.js"
      : "src/api_labass/models/**/*.ts",
  ],
  migrations: [
    process.env.NODE_ENV === "production"
      ? "dist/api_labass/migration/**/*.js"
      : "src/api_labass/migration/**/*.ts",
  ],
  subscribers: [
    process.env.NODE_ENV === "production"
      ? "dist/api_labass/subscriber/**/*.js"
      : "src/api_labass/subscriber/**/*.ts",
  ],
});
export const OTPDataSource = new DataSource({
  type: "sqlite",
  database:
    process.env.SQLITE_DB_PATH || "./data/development/otp_storage.sqlite", // Specify the path to your SQLite DB for OTPs
  entities: [
    // Path to your OTP entity if it's different from your main entities
    process.env.NODE_ENV === "production"
      ? "dist/api_labass/otpmodel/**/*.js"
      : "src/api_labass/otpmodel/**/*.ts",
  ],
  
  synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
  // Additional SQLite config as needed...
});
export default AppDataSource;
