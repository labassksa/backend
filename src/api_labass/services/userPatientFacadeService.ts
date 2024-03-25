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

  async fillUserInfoAndCreatePatient(
    userId: number,
    userInfo: Partial<User>,
    role: string
  ): Promise<User> {
    try {
      let user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error("User not found, signin first using otp");
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
