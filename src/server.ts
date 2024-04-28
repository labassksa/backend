import "reflect-metadata";
import "./container.registerClass";
import "dotenv/config";
import express from "express";
import { AppDataSource, OTPDataSource } from "./configuration/ormconfig";
import userRouter from "./api_labass/routes/userRoutes";
import otpRouter from "./api_labass/routes/otpRoutes";
import authRouter from "./api_labass/routes/authRoute";
import { container } from "tsyringe";
import patientRouter from "./api_labass/routes/patientRoutes";
import insuranceRouter from "./api_labass/routes/insuranceRoutes";
import { ConsultationService } from "./api_labass/services/consultationService";
import consultationRouter from "./api_labass/routes/consultationRoutes";
import prescriptionRouter from "./api_labass/routes/prescriptionRoutes";
import soapRouter from "./api_labass/routes/soapRoutes";
import sickLeaveRouter from "./api_labass/routes/sickLeaveRoutes";
import marketerRouter from "./api_labass/routes/marketerRoutes";
import promoCodeRouter from "./api_labass/routes/promoCodeRoutes";
import doctorRouter from "./api_labass/routes/doctorRoutes";
import { Server as SocketIO } from "socket.io";
import { createServer } from "http";
import { initializeSocket } from "./api_labass/controllers/socketIOController";
import { MongoClient } from "mongodb";

const app = express();
//By using the http module:
//create a server that both your Express application and Socket.IO can attach to
const httpServer = createServer(app);
const io = new SocketIO(httpServer, {
  cors: {
    origin: "*", // Adjust according to your CORS policy // Be sure to tighten this for production!
    //methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;
console.log(`Server running on port ${PORT}`);
console.log(`env variable for Password: ${process.env.DB_PASSWORD}`);
app.use(express.json());

// MongoDB connection URI
// const uri = "mongodb://root:example@localhost:27018";
// const client = new MongoClient(uri, {});
// Initialize Socket.IO with the separated logic
initializeSocket(io);

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
    app.use("/api_labass", doctorRouter);

    // Use httpServer to listen instead of app.listen
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    // app.listen(PORT, () => {
    //   console.log(`Server running on port ${PORT}`);
    // });
    // Resolve ConsultationService from the container
    const consultationService = container.resolve(ConsultationService);

    //simulate a consultation
    // await consultationService.improvedupdateStatus( 2 , "PAYMENT_SUCCESSFUL");
    // await consultationService.improvedupdateStatus(2 , "DOCTOR_STARTS");
    // await consultationService.improvedupdateStatus(2 , "PATIENT_JOINS");
    // await consultationService.improvedupdateStatus(2, "END_CONSULTATION");

    // console.log("Created consultation:", createdConsultation);
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}
startServer();
