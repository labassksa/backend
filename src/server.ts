import "dotenv/config";
import { AppDataSource } from "./configuration/ormconfig";
import express from "express";
import userRoutes from "./api_labass/routes/userRoutes";
import "reflect-metadata";
import dotenv from "dotenv";

// Dynamically load the correct .env file based on NODE_ENV

const result = dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
console.log(`Environment is ${process.env.NODE_ENV}`);
console.log(`Password is ${process.env.DB_PASSWORD}`);
console.log(`TZ is ${process.env.TZ}`);

if (result.error) {
  throw result.error;
}

// Your application code starts here

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    // Your application logic here, e.g., starting up an express server
    console.log(process.env.PORT);
    const app = express();
    const PORT = process.env.PORT || 3000;

    // // Routes
    // app.use("/api");
    // app.use("/", userRoutes);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: string) => {
    console.error("Error during Data Source initialization:", error);
  });
