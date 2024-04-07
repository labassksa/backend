import "reflect-metadata";
import "./container.registerClass";
import "dotenv/config";
import express from "express";
import { AppDataSource, OTPDataSource } from "./configuration/ormconfig";
import userRouter from "./api_labass/routes/userRoutes";
import otpRouter from "./api_labass/routes/otpRoute";
import authRouter from "./api_labass/routes/authRoute";
import { container } from "tsyringe";
import patientRouter from "./api_labass/routes/patientRoutes";
import insuranceRouter from "./api_labass/routes/insuranceRoute";
import { ConsultationService } from "./api_labass/services/ConsultationService";
import consultationRouter from "./api_labass/routes/consultationRoute";
import prescriptionRouter from "./api_labass/routes/prescriptionRoute";
import soapRouter from "./api_labass/routes/SOAPRoute";
import sickLeaveRouter from "./api_labass/routes/sickLeaveRoute";
import marketerRouter from "./api_labass/routes/marketerRoute";
import { PromotionalCode } from "./api_labass/models/PromotionalCode";
import promoCodeRouter from "./api_labass/routes/PromoCodeRoute";

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
    app.use("/api_labass", consultationRouter);
    app.use("/api_labass", prescriptionRouter);
    app.use("/api_labass", soapRouter);
    app.use("/api_labass", sickLeaveRouter);
    app.use("/api_labass", marketerRouter);
    app.use("/api_labass", promoCodeRouter);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    // Resolve ConsultationService from the container
    const consultationService = container.resolve(ConsultationService);

    //simulate a consultation
    // await consultationService.improvedupdateStatus( 46 , "PAYMENT_SUCCESSFUL");
    // await consultationService.improvedupdateStatus(46 , "DOCTOR_STARTS");
    // await consultationService.improvedupdateStatus(46 , "PATIENT_JOINS");
    // await consultationService.improvedupdateStatus(46, "END_CONSULTATION");

    // console.log("Created consultation:", createdConsultation);
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}
startServer();
