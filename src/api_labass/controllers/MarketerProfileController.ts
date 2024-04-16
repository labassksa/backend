import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { MarketerProfileService } from "../services/marketerProfileService";

@injectable()
export class MarketerProfileController {
  constructor(
    @inject(MarketerProfileService)
    private marketerProfileService: MarketerProfileService
  ) {}

  createMarketer = async (req: Request, res: Response) => {
    try {
      const marketerProfile = await this.marketerProfileService.createMarketer(
        req.body
      );
      res.status(201).json(marketerProfile);
    } catch (error) {
      res.status(500).json({
        message: `Failed to create marketer profile: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  // fetch a marketer profile by marketer ID
  getMarketerProfile = async (req: Request, res: Response) => {
    try {
      const { marketerId } = req.params;
      const marketerProfile =
        await this.marketerProfileService.getMarketerProfileByMarketerId(
          Number(marketerId)
        );
      if (marketerProfile) {
        res.json(marketerProfile);
      } else {
        res.status(404).json({ message: "Marketer profile not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: `Failed to retrieve marketer profile: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  getMarketerWithPromotionalCodes = async (req: Request, res: Response) => {
    try {
      const { marketerId } = req.params;
      const marketerProfile =
        await this.marketerProfileService.getMarketerProfileByIdWithPromotionalCodes(
          Number(marketerId)
        );
      if (marketerProfile) {
        res.json(marketerProfile);
      } else {
        res.status(404).json({ message: "Marketer profile not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: `Failed to retrieve marketer profile: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };

  getAllMarketerProfiles = async (_: Request, res: Response) => {
    try {
      const marketerProfiles =
        await this.marketerProfileService.getAllMarketerProfilesWithUserDetails();
      res.json(marketerProfiles);
    } catch (error) {
      res.status(500).json({
        message: `Failed to retrieve all marketer profiles: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };
  // Placeholder for updateMarketerProfile
  // Placeholder for deleteMarketerProfile
}
