import { injectable, inject } from "tsyringe";
import { Repository } from "typeorm";
import { Insurance } from "../models/insurance";
import { PatientService } from "./patientService";
import AppDataSource from "../../configuration/ormconfig";

// Example utility function that simulates fetching insurance data from an external API
async function fetchInsuranceDataFromAPI(
  nationalId: string
): Promise<Partial<Insurance>> {
  // Simulate API call
  // This is where you would make an actual HTTP request to the insurance API
  // For example, using fetch() or axios.get() and passing the nationalId as a parameter
  // The response should then be parsed into the format expected by your Insurance model

  // Placeholder response structure
  return {
    provider: "Example Insurance Co.",
    policyNumber: "ABC123456",
    coverageDetails: "Full coverage",
    expirationDate: new Date("2023-12-31"), // Example expiration date
  };
}

@injectable()
export class InsuranceService {
  private insuranceRepository: Repository<Insurance>;

  constructor(@inject(PatientService) private patientService: PatientService) {
    this.insuranceRepository = AppDataSource.getRepository(Insurance);
  }

  async linkInsurance(userId: number, nationalId?: string): Promise<Insurance> {
    try {
      const patientProfileResult = await this.patientService.hasPatientProfile(
        userId
      );
      if (!patientProfileResult.exists) {
        throw new Error(
          patientProfileResult.message ||
            "Patient profile required for insurance linkage."
        );
      }

      // Fetch insurance data from external Insurance company API
      const insuranceData = await fetchInsuranceDataFromAPI(nationalId!);

      const insurance = this.insuranceRepository.create({
        ...insuranceData,
        patientProfile: patientProfileResult.profile,
      });
      await this.insuranceRepository.save(insurance);
      return insurance;
    } catch (error) {
      throw new Error(
        `Failed to link insurance: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  }

  async updateInsurance(
    id: number,
    insuranceData: Partial<Insurance>
  ): Promise<Insurance> {
    try {
      await this.insuranceRepository.update(id, insuranceData);
      const updatedInsurance = await this.insuranceRepository.findOne({
        where: { id },
        relations: ["patientProfile"],
      });
      if (!updatedInsurance) {
        throw new Error("Insurance not found.");
      }
      return updatedInsurance;
    } catch (error) {
      throw new Error(
        `Failed to update insurance: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  }

  async getInsuranceById(id: number): Promise<Insurance | null> {
    try {
      const insurance = await this.insuranceRepository.findOne({
        where: { id },
        relations: ["patientProfile"],
      });
      if (!insurance) {
        throw new Error("Insurance not found.");
      }
      return insurance;
    } catch (error) {
      throw new Error(
        `Failed to retrieve insurance: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  }

  async deleteInsurance(id: number): Promise<void> {
    try {
      const result = await this.insuranceRepository.delete(id);
      if (result.affected === 0) {
        throw new Error("Insurance not found or already deleted.");
      }
    } catch (error) {
      throw new Error(
        `Failed to delete insurance: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  }

  async getAllInsurancesForUser(userId: number): Promise<Insurance[]> {
    try {
      const patientProfileResult = await this.patientService.hasPatientProfile(
        userId
      );

      // Now that we have confirmed the user has a patient profile, we retrieve all insurances linked to him.
      const insurances = await this.insuranceRepository.find({
        where: { patientProfile: { id: patientProfileResult.profile?.id } },
        relations: ["patientProfile"],
      });

      return insurances;
    } catch (error) {
      throw new Error(
        `Failed to retrieve insurances for the user: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  }
}
