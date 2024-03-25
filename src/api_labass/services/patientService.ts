import { User } from "../models/user";
import { PatientProfile } from "../models/patientProfile";
import { inject, injectable } from "tsyringe";
import { UserService } from "./UserService";
import AppDataSource from "../../configuration/ormconfig";
import { Roles } from "../../types/roles";


@injectable()
export class PatientService {
  private patientProfileRepository = AppDataSource.getRepository(PatientProfile);

  constructor(@inject(UserService) private userService: UserService) { }

  async createPatientProfileForUser(
    user: User,

    role: string
  ): Promise<PatientProfile | null> {
    try {
      // Retrieve the user using UserService
      if (role !== Roles.Patient) {
        // If the user's role is not "patient", do not create a PatientProfile
        console.log(
          "User role is not 'patient'. Skipping PatientProfile creation."
        );
        return null;
      }

      // Assuming user linkage is managed via a user ID reference in patientProfileData
      const newPatientProfile = this.patientProfileRepository.create({
        user,
      });
      await this.patientProfileRepository.save(newPatientProfile);

      return newPatientProfile;
    } catch (error) {
      console.error("Failed to create patient profile:", error);
      throw new Error("Failed to create patient profile.");
    }
  }

  // Ensure a user "completed his/her info" by having a PatientProfile
  async hasPatientProfile(
    userId: number
  ) {
    try {
      const patientProfile = await this.patientProfileRepository.findOne({
        where: { user: { id: userId } },
      });

      if (patientProfile) {
        return { exists: true, profile: patientProfile, message: "Patient Profile exists" };
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
    dependentUserInfo: Partial<User>
  ): Promise<PatientProfile> {
    try {
      // Ensure guardian has completed their info
      const guardianPatientProfile = await this.hasPatientProfile(
        guardianUserId
      );

      // Create User entity for the dependent
      let dependentUser: User;
      try {
        dependentUser = await this.userService.createDependentUser(
          dependentUserInfo
        );
      } catch (error) {
        console.error("Error creating user for dependent:", error);
        throw new Error(`${error}`);
      }

      // Create PatientProfile for the dependent
      let dependentPatientProfile: PatientProfile;
      try {
        dependentPatientProfile = await this.patientProfileRepository.create({
          user: dependentUser, // Link the newly created User entity
          guardian: guardianPatientProfile.profile, // Link to the guardian's patient entity
        });
        await this.patientProfileRepository.save(dependentPatientProfile);
      } catch (error) {
        console.error("Error creating patient profile for dependent:", error);
        throw new Error(
          `Failed to create patient profile for dependent ${error}`
        );
      }

      return dependentPatientProfile;
    } catch (error) {
      console.error("Failed to add dependent:", error);
      throw error; // Propagate the error or handle it as needed
    }
  }

  // Retrieve dependents for a given user ID
  async getDependentsForUser(userId: number): Promise<PatientProfile[]> {
    try {
      // Attempt to find the guardian's patient profile.
      const guardianPatient = await this.hasPatientProfile(userId);

      if (!guardianPatient.exists || !guardianPatient.profile) {
        throw new Error(
          "Guardian/User did not fill the required info, and his patient profile does not exist."
        );
      }

      // Retrieve dependents based on the guardian's profile ID, loading related 'user' and 'dependents' entities.
      const dependents = await this.patientProfileRepository.find({
        where: { guardian: { id: guardianPatient.profile.id } },
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
