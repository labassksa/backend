import "reflect-metadata";
import { container } from "tsyringe";
import { AuthService } from "./api_labass/services/AuthService";
import { OTPService } from "./api_labass/services/OTPService";
import { ConsultationService } from "./api_labass/services/ConsultationService";
import { PatientService } from "./api_labass/services/PatientService";
import { UserService } from "./api_labass/services/UserService";

// Register services
container.registerSingleton("AuthService", AuthService);
container.registerSingleton("OTPService", OTPService);
container.registerSingleton("UserService", UserService);
container.registerSingleton("PatientService", PatientService);
container.registerSingleton("ConsultationService", ConsultationService);
