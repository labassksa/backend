// Assuming this file is located at: services/DoctorProfileService.ts
import { injectable, inject } from "tsyringe";
import AppDataSource from "../../configuration/ormconfig";
import { DoctorProfile } from "../models/DoctorProfile";
import { UserService } from "./UserService";
import { Consultation } from "../models/Consultation";
import { ConsultationStatus } from "../../types/consultationstatus";
import { User } from "../models/User";
import { Roles } from "../../types/roles";

@injectable()
export class DoctorProfileService {
  private readonly doctorProfileRepository =
    AppDataSource.getRepository(DoctorProfile);
  private readonly consultationRepository =
    AppDataSource.getRepository(Consultation);

  constructor(@inject(UserService) private userService: UserService) {}

  // Other service methods...

  async createDoctor(
    doctorUserData: Partial<User> & {
      specialty: string;
      medicalLicenseNumber: string;
      iban: string;
    }
  ): Promise<DoctorProfile> {
    const { specialty, medicalLicenseNumber, iban, ...userData } =
      doctorUserData;

    // Create a new User instance for the doctor with the role 'doctor' and additional user data
    const user = await this.userService.createPartialUser(
      // Assuming there's a corresponding role for doctors
      Roles.Doctor,
      doctorUserData.phoneNumber,
      userData
    );

    const doctorProfile = this.doctorProfileRepository.create({
      user,
      specialty,
      medicalLicenseNumber,
      iban,
    });
    await this.doctorProfileRepository.save(doctorProfile);

    return doctorProfile;
  }

  async getAllDoctorProfilesWithConsultationCounts(): Promise<any[]> {
    const doctorProfiles = await this.doctorProfileRepository.find({
      relations: ["user"], // Adjust based on your relationship setup
    });

    // Assuming that each doctorProfile has an ID and that consultations are related to doctor profiles by a doctorId
    const doctorProfilesWithCounts = await Promise.all(
      doctorProfiles.map(async (doctor) => {
        const consultationCount = await this.consultationRepository.count({
          where: {
            doctor: { id: doctor.id },
            status: ConsultationStatus.Closed, // Assuming 'closed' status represents completed consultations
          },
        });

        return {
          ...doctor,
          consultationCount,
        };
      })
    );

    return doctorProfilesWithCounts;
  }
}
