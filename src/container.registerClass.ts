import "reflect-metadata";
import { container } from "tsyringe";
import { AuthService } from "./api_labass/services/authService";
import { OTPService } from "./api_labass/services/otpService";
import { ConsultationService } from "./api_labass/services/consultationService";
import { PatientService } from "./api_labass/services/patientService";
import { UserService } from "./api_labass/services/userService";

// Register services
container.registerSingleton("AuthService", AuthService);
container.registerSingleton("OTPService", OTPService);
container.registerSingleton("UserService", UserService);
container.registerSingleton("PatientService", PatientService);
container.registerSingleton("ConsultationService", ConsultationService);
