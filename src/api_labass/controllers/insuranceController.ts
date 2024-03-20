import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { InsuranceService } from "../services/InsuranceService";

@injectable()
export class InsuranceController {
  constructor(
    @inject(InsuranceService) private insuranceService: InsuranceService
  ) {}

  linkInsurance = async (req: Request, res: Response) => {
    try {
      const nationalId = req.user.nationalId;
      const userId = req.user.id; // Assuming user's ID is attached to req.user by auth middleware

      const insurance = await this.insuranceService.linkInsurance(
        userId,
        nationalId
      );
      res.status(201).json(insurance);
    } catch (error) {
      res.status(500).json({
        message: `Error linking insurance: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  updateInsurance = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const insuranceData = req.body;
      const updatedInsurance = await this.insuranceService.updateInsurance(
        Number(id),
        insuranceData
      );
      res.status(200).json(updatedInsurance);
    } catch (error) {
      res.status(500).json({
        message: `Error updating insurance: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  getInsuranceById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const insurance = await this.insuranceService.getInsuranceById(
        Number(id)
      );
      res.status(200).json(insurance);
    } catch (error) {
      res.status(500).json({
        message: `Error retrieving insurance inside get insurance is: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  deleteInsurance = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.insuranceService.deleteInsurance(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        message: `Error deleting insurance: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  listAllInsurancesForUser = async (req: Request, res: Response) => {
    try {
      const userId: number = req.user.id;
      console.log(userId); // Assuming user's ID is attached to req.user by auth middleware
      const insurances = await this.insuranceService.getAllInsurancesForUser(
        userId
      );
      res.status(200).json(insurances);
    } catch (error) {
      res.status(500).json({
        message: `Error listing insurances for user: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };
}
