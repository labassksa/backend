import { User } from "../models/user";
import { PatientProfile } from "../models/patientProfile";
import { inject, injectable } from "tsyringe";
import { UserService } from "./userService";
import AppDataSource from "../../configuration/ormconfig";

@injectable()
export class PatientService {
  private patientProfileRepository =
    AppDataSource.getRepository(PatientProfile);
  private userRepo = AppDataSource.getRepository(User);

  constructor(@inject(UserService) private userService: UserService) {}

  async createPatientProfileForUser(
    user: User,
    userInfo: Partial<User>,
    patientProfile?: PatientProfile
  ): Promise<User> {
    try {
      // create and save patient profile for the user
      const patientProfile = this.patientProfileRepository.create({
        user: user,
      });

      await this.patientProfileRepository.save(patientProfile);

      // update the user record
      const updatedUser = await this.userService.updateUser(user.id, userInfo);
      if (!updatedUser) {
        throw new Error("User Can not be updated");
      }
      return updatedUser;
    } catch (error) {
      console.error("Failed to create patient profile:", error);
      throw new Error("Failed to create patient profile.");
    }
  }
  async createPatient(user: User): Promise<PatientProfile> {
    try {
      // create and save patient profile for the user
      const patientProfile = this.patientProfileRepository.create({
        user: user,
      });

      await this.patientProfileRepository.save(patientProfile);

      return patientProfile;
    } catch (error) {
      console.error("Failed to create patient profile:", error);
      throw new Error("Failed to create patient profile.");
    }
  }
  async getPatient(user: User) {
    try {
      const patientProfile = await this.patientProfileRepository.findOne({
        where: { user: { id: user.id } },
      });
      if (patientProfile) {
        return {
          exists: true,
          profile: patientProfile,
          message: "Patient Profile exists",
        };
      } else {
        return { exists: false, message: "Patient profile does not exist." };
      }
    } catch (error) {
      console.error("Failed to retrieve patient profile:", error);
      throw new Error("Failed to retrieve patient profile.");
    }
  }

  // Ensure a user "completed his/her info" by having a PatientProfile
  async hasPatientProfile(userId: number) {
    try {
      const patientProfile = await this.patientProfileRepository.findOne({
        where: { user: { id: userId } },
      });

      if (patientProfile) {
        return {
          exists: true,
          profile: patientProfile,
          message: "Patient Profile exists",
        };
      } else {
        return { exists: false, message: "Patient profile does not exist." };
      }
    } catch (error) {
      console.error("Error checking for patient profile:", error);
      throw new Error("Failed to check for patient profile.");
    }
  }

  // Add a dependent by linking PatientProfile instances
  async addDependent(
    guardianUserId: number,
    dependentUserInfo: Partial<User>,
    guardianPatientProfile: PatientProfile
  ): Promise<PatientProfile> {
    try {
      const dependentUser = await this.userService.createDependentUser(
        dependentUserInfo
      );
      const dependentPatientProfile = this.patientProfileRepository.create({
        user: dependentUser, // Link the newly created User entity
        guardian: guardianPatientProfile,
      });
      console.log("Guardian ID:", guardianPatientProfile.id);
      console.log("Dependent User:", dependentUser);
      await this.patientProfileRepository.save(dependentPatientProfile);
      return dependentPatientProfile;
    } catch (error) {
      console.error(
        "Error creating user for dependent or error in creating patient profile for dependent",
        error
      );
      throw new Error(
        `Error creating user for dependent or error in creating patient profile for dependent${error}`
      );
    }
  }

  // Retrieve dependents for a given user ID
  async getDependentsForUser(
    userId: number,
    guardianPatientProfile: PatientProfile
  ): Promise<PatientProfile[]> {
    try {
      // Attempt to find the guardian's patient profile.

      // Retrieve dependents based on the guardian's profile ID, loading related 'user' and 'dependents' entities.
      const dependents = await this.patientProfileRepository.find({
        where: { guardian: { id: guardianPatientProfile.id } },
        relations: ["user"],
      });

      return dependents;
    } catch (error) {
      // Log the error for debugging purposes.
      console.error("Failed to retrieve dependents for user:", error);
      // Re-throw the error to allow further upstream handling, such as sending an HTTP response with an error message.
      throw new Error(`Failed to retrieve dependents.: ${error}`);
    }
  }
}
