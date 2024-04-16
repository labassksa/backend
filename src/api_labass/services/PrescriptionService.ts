import { getRepository } from "typeorm";
import { Prescription } from "../models/prescription";
import { Consultation } from "../models/consultation";
import { inject, injectable } from "tsyringe";
import AppDataSource from "../../configuration/ormconfig";
import { ConsultationService } from "./consultationService";

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
    const consultation =
      await this.consultationService.getConsultationWithRelatedEntity(
        consultationId,
        "prescription"
      );

    // If a prescription exists, update it; otherwise, create a new Prescription object
    let prescription = consultation.prescription || new Prescription();
    // Assign the provided prescription data to the prescription object
    Object.assign(prescription, prescriptionData);

    // Link the prescription back to the consultation
    consultation.prescription = prescription;

    // Persist changes to the database
    await this.consultationService.saveConsultation(consultation);
  }

  async getPrescriptionByConsultationId(
    consultationId: number
  ): Promise<Prescription | undefined> {
    const consultation =
      await this.consultationService.getConsultationWithRelatedEntity(
        consultationId,
        "prescription"
      );
    return consultation.prescription;
  }

  // Include additional methods for other common operations as needed
}
