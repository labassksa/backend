import { getRepository } from "typeorm";
import { Prescription } from "../models/Prescription";
import { Consultation } from "../models/Consultation";
import { inject, injectable } from "tsyringe";
import AppDataSource from "../../configuration/ormconfig";
import { ConsultationService } from "./ConsultationService";

@injectable()
export class PrescriptionService {
  // Repository for consultations to access consultation and its prescription

  private readonly consultationRepository =
    AppDataSource.getRepository(Consultation);
  constructor(
    @inject(ConsultationService)
    private consultationService: ConsultationService
  ) {}
  /**
   * Issues or updates a prescription for a given consultation.
   * If the consultation already has a prescription, it's updated; otherwise, a new prescription is created.
   *
   * param {number} consultationId - The ID of the consultation to issue/update the prescription for.
   * param {Partial<Prescription>} prescriptionData - The prescription data to be saved.
   */
  async issueOrUpdatePrescription(
    consultationId: number,
    prescriptionData: Partial<Prescription>
  ) {
    // Attempt to find the consultation with its prescription loaded
    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId },
      relations: ["prescription"],
    });
    // const consultation = await this.consultationService.getConsultation(
    //   consultationId
    // );

    // If no consultation found, throw an error
    if (!consultation) {
      throw new Error(`Consultation with ID ${consultationId} not found.`);
    }

    // If a prescription exists, update it; otherwise, create a new Prescription object
    let prescription = consultation.prescription || new Prescription();
    // Assign the provided prescription data to the prescription object
    Object.assign(prescription, prescriptionData);

    // Link the prescription back to the consultation
    consultation.prescription = prescription;

    // Persist changes to the database
    await this.consultationService.saveConsultation(consultation);
  }

  /**
   * Retrieves the prescription for a given consultation ID.
   *
   * param {number} consultationId - The ID of the consultation to retrieve the prescription for.
   * returns {Prescription | undefined} The found prescription, or undefined if no prescription is found.
   */
  async getPrescriptionByConsultationId(
    consultationId: number
  ): Promise<Prescription | undefined> {
    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId },
      relations: ["prescription"],
    });

    return consultation?.prescription;
  }

  // Include additional methods for other common operations as needed
}
