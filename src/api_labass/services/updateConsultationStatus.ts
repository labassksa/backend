import { Consultation } from "../models/consultation";
import { ConsultationStatus } from "../../types/consultationstatus";
import AppDataSource from "../../configuration/ormconfig";

// Placeholder for any async logic you might want to use within the machine
// const promiseLogic = fromPromise(async () => {
//   // Your async logic here
// });
// function getGreeting(name: string): PromiseLike<unknown> {
//   throw new Error("Function not implemented.");
// }
export async function updateConsultationStatus({
  consultationId,
  newStatus,
}: {
  consultationId: number;
  newStatus: ConsultationStatus;
}) {
  try {
    // Assuming AppDataSource is already initialized and connected
    const consultationRepository = AppDataSource.getRepository(Consultation);
    const consultationToUpdate = await consultationRepository.findOne({
      where: { id: consultationId },
    });

    if (!consultationToUpdate) {
      console.log(`Consultation with ID ${consultationId} not found.`);
      return new Error(`Consultation with ID ${consultationId} not found.`);
    }

    consultationToUpdate.status = newStatus;
    await consultationRepository.save(consultationToUpdate);
    console.log(
      `Updated consultation ${consultationId} to status ${newStatus}`
    );
  } catch (error) {
    console.error("Failed to update consultation status:", error);
  }
  // Delay of 1 second
}
