import { config } from "dotenv";

// Assuming your NODE_ENV will be one of 'development', 'test', 'production'
// This will default to '.env.development' if NODE_ENV is not set
config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

import { DataSource } from "typeorm";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_DATABASE),
  synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE), // Use cautiously in production
  logging: Boolean(process.env.TYPEORM_LOGGING),
  entities: ["src/api_labass/models/**/*.ts"],
  migrations: ["src/api_labass/migration/**/*.ts"],
  subscribers: ["src/api_labass/subscriber/**/*.ts"],
});
