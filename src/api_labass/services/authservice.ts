//Authentication Service: Handles the logic for signing in users and issuing JWT tokens.
//This service will authenticate the user using OTP code and through two factor authentication. Upon success,
//generate a JWT token that includes relevant user information (such as user ID and role).

//Implement functions to authenticate users and generate JWT tokens.
//Use packages like jsonwebtoken for token generation and verification

import jwt from "jsonwebtoken";
import { UserService } from "./userService"; // Assuming you have this service
import { OTPService } from "./otpService"; // Your SMS verification service
import { inject, injectable } from "tsyringe";
import { PatientService } from "./patientService";
import { Roles } from "../../types/roles";

export
@injectable()
class AuthService {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(PatientService) private patientService: PatientService,
    @inject(OTPService) private otpService: OTPService
  ) {}

  async verifyOTPAndAuthenticate(
    role: string,
    phoneNumber: string,
    otpcode: string
  ): Promise<string> {
    try {
      // Await the OTP verification. An error will be thrown and caught below if verification fails.
      await this.otpService.verifyCode(role, phoneNumber, otpcode);

      // Proceed with finding the user if the user record exists
      let user = await this.userService.findUserByPhoneNumber(phoneNumber);
      //or Proceed with creating the user since OTP verification succeeded and the user would like to register
      if (!user) {
        user = await this.userService.createPartialUser(role, phoneNumber);
      }

      //create patient profile for the user during sign in and use it later for fetching consultation/consultations related to the patient
      const patient = await this.patientService.hasPatientProfile(user.id);
      if (!patient.exists && role === Roles.Patient) {
        await this.patientService.createPatient(user);
      }

      // Generate JWT for the verified user, and log him in
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          patientProfile: patient.profile,
        },
        process.env.JWT_SECRET!
      );

      return token;
    } catch (error) {
      // Handle or log the error as appropriate for your application
      console.error("Authentication error:", error);
      throw error; // Ensure the error is propagated or handled appropriately
    }
  }
}
