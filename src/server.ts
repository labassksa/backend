import "reflect-metadata";
import "./container.registerClass";
import "dotenv/config";
import express from "express";
import { AppDataSource, OTPDataSource } from "./configuration/ormconfig";
import userRouter from "./api_labass/routes/userRoutes";
import otpRouter from "./api_labass/routes/otpRoute";
import authRouter from "./api_labass/routes/authRoute";
import { container } from "tsyringe";
import { AuthService } from "./api_labass/services/AuthService";
import { OTPService } from "./api_labass/services/OTPService";
import patientRouter from "./api_labass/routes/patientRoutes";
import insuranceRouter from "./api_labass/routes/insuranceRoute";
import { ConsultationService } from "./api_labass/services/consultationService";

const app = express();
const PORT = process.env.PORT || 3000;
console.log(`Server running on port ${PORT}`);
console.log(`env variable for Password: ${process.env.DB_PASSWORD}`);
app.use(express.json());

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
    app.use("/api_labass", patientRouter);
    app.use("/api_labass", insuranceRouter);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    // Resolve ConsultationService from the container
    const consultationService = container.resolve(ConsultationService);

    // Example call to createConsultation - replace userId with a valid user ID from your system
    // const userId = 2; // Placeholder user ID
    // const createdConsultation = await consultationService.createConsultation(
    //   userId
    // );
     await consultationService.updateStatus(20)

    // console.log("Created consultation:", createdConsultation);
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}
startServer();
