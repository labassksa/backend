import { inject, injectable } from "tsyringe";
import { UserService } from "./UserService";
import { PatientService } from "./PatientService";
import { User } from "../models/user";
import AppDataSource from "../../configuration/ormconfig";
import { Roles } from "../../types/roles";

export
@injectable()
class UserPatientFacade {
  private readonly userRepository = AppDataSource.getRepository(User);
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(PatientService) private patientService: PatientService
  ) {}
  // async fillUserInfoAndCreatePatient(
  //   userId: number,
  //   userInfo: Partial<User>,
  //   role: string
  // ): Promise<User> {
  //   try {
  //     let user = await this.userRepository.findOneBy({ id: userId });
  //     console.log(user);
  //     const userPatientProfile = await this.patientService.hasPatientProfile(userId);
  //     if (!userPatientProfile) {
  //       user = await this.userService.updateUser(userId, userInfo);
  //     }
  //     // Update user information

  //     // Delegate to PatientService to potentially create a PatientProfile based on the role
  //     if (role === Roles.Patient && !userPatientProfile ) {
  //       await this.patientService.createPatientProfileForUser(
  //         user!,

  //         role
  //       );
  //     }

  //     return user!;
  //   } catch (error) {
  //     console.error(
  //       "Failed to complete user info or create patient profile:",
  //       error
  //     );
  //     throw new Error(`Failed to complete user info: ${error}`);
  //   }
  // }

  // the scenario of a user needing to update their information before a patient profile can be created.
  // This involves verifying if the user exists and if they already have a patient profile.
  // If they don't have a patient profile and the role is Patient, 
  // we'll proceed to update their information and then create the patient profile.
  async fillUserInfoAndCreatePatient(
    userId: number,
    userInfo: Partial<User>,
    role: string
  ): Promise<User> {
    try {
      let user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error("User not found.");
      }
      console.log(user);

      const userPatientProfile = await this.patientService.hasPatientProfile(
        userId
      );
      if (!userPatientProfile.exists) {
        user = await this.userService.updateUser(userId, userInfo);
      }

      if (role === Roles.Patient && !userPatientProfile.exists) {
        await this.patientService.createPatientProfileForUser(user!, role);
      } else if (userPatientProfile.exists) {
        throw new Error("User already has a patient profile.");
      }

      return user!;
    } catch (error) {
      console.error(
        "Failed to complete user info or create patient profile:",
        error
      );
      throw new Error(`Failed to complete user info: ${error}`);
    }
  }
}
