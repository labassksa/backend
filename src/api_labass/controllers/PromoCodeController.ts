import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { PromotionalCodeService } from '../services/promoCodeService';

@injectable()
export class PromotionalCodeController {
  constructor(
    @inject(PromotionalCodeService)
    private promotionalCodeService: PromotionalCodeService
  ) {}

  generateCode = async (req: Request, res: Response) => {
    try {
      const { marketerId, discountPercentage, marketerPercentage, marketerOrganizationPercentage } = req.body;
  
      if (!marketerId) {
        return res.status(400).json({ message: 'Marketer ID is required' });
      }
  
      // Pass the extracted parameters to the service method, including the optional ones
      const promotionalCode = await this.promotionalCodeService.generateCodeForMarketer(marketerId, {
        discountPercentage,
        marketerPercentage,
        marketerOrganizationPercentage,
      });
  
      res.json(promotionalCode);
    } catch (error) {
      res.status(500).json({
        message: `Failed to generate promotional code: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };
  

  activateDeactivateCode = async (req: Request, res: Response) => {
    try {
      const { codeId, isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: 'isActive must be a boolean value' });
      }

      const updatedCode = await this.promotionalCodeService.togglePromotionalCodeActivation(codeId, isActive);
      res.json(updatedCode);
    } catch (error) {
      res.status(500).json({
        message: `Failed to update promotional code status: ${
          error instanceof Error ? error.message : error
        }`,
      });
    }
  };
}
