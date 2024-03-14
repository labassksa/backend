import "reflect-metadata";
import "dotenv/config";
import express from "express";
import {AppDataSource , OTPDataSource} from "./configuration/ormconfig";
import userRouter from "./api_labass/routes/userRoutes";
import otpRouter from "./api_labass/routes/otpRoute";
import authRouter from "./api_labass/routes/authRoute";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerConfig from "./documentation/swaggerConfig.json";

const app = express();
const PORT = process.env.PORT || 3000;
console.log(`Server running on port ${PORT}`);
console.log(`env variable for Password: ${process.env.DB_PASSWORD}`);
app.use(express.json());

// Set up Swagger UI before database initialization to ensure it's always accessible
const swaggerSpec = swaggerJSDoc(swaggerConfig);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function startServer() {
  //initialize the postgress db
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
    await OTPDataSource.initialize(); // Initialize SQLite database for OTPs
    console.log("SQLite OTP Data Source has been initialized!");
    // Routes setup after successful database initialization
    app.use("/api_labass", userRouter);
    app.use("/api_labass", otpRouter);
    app.use("/api_labass", authRouter);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}
startServer();
