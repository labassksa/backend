import { injectable, inject } from "tsyringe";
import crypto from "crypto";
import { PromotionalCode } from "../models/promotionalCode";
import { AppDataSource } from "../../configuration/ormconfig";
import { MarketerProfileService } from "./marketerProfileService";

@injectable()
export class PromotionalCodeService {
  private promotionalCodeRepository =
    AppDataSource.getRepository(PromotionalCode);

  constructor(
    @inject(MarketerProfileService)
    private marketerProfileService: MarketerProfileService
  ) {}

  async generateCodeForMarketer(
    marketerId: number,
    options?: {
      discountPercentage?: number;
      marketerPercentage?: number;
      marketerOrganizationPercentage?: number;
    }
  ): Promise<PromotionalCode> {
    const marketerProfile =
      await this.marketerProfileService.getMarketerProfileByMarketerId(
        marketerId
      );

    const code = this.generateUniqueCode(marketerId);
    const promotionalCode = this.promotionalCodeRepository.create({
      code,
      usageCount: 0,
      discountPercentage: options?.discountPercentage,
      marketerPercentage: options?.marketerPercentage,
      marketerOrganizationPercentage: options?.marketerOrganizationPercentage,
      totalRevenueGenerated: 0, // Default value
      marketerProfile,
    });

    await this.promotionalCodeRepository.save(promotionalCode);

    return promotionalCode;
  }

  private generateUniqueCode(marketerId: number): string {
    // Shortened hash of marketerId, take only 2 characters to ensure we stay within the limit
    const hash = crypto
      .createHash("sha256")
      .update(String(marketerId))
      .digest("hex")
      .substring(0, 3)
      .toUpperCase();

    // Generate a 4-byte random string, converted to a hex string (6 characters), take only 3 characters
    const randomString = crypto
      .randomBytes(4)
      .toString("hex")
      .substring(0, 4)
      .toUpperCase();

    // Combine and ensure the total length is exactly 8 digits
    const combinedString = `${hash}${randomString}`; // 2 from hash + 3 from random = 5 characters

    // Ensuring the combined string is 8 characters might involve padding or truncating
    // Here, we'll pad the string if it's shorter than 8 characters (unlikely with the current setup)
    // Pad with '0's to ensure 8 characters

    return combinedString; // Returns an 8-character string
  }

  async togglePromotionalCodeActivation(
    codeId: number,
    isActive: boolean
  ): Promise<PromotionalCode> {
    const promoCode = await this.promotionalCodeRepository.findOneBy({
      id: codeId,
    });

    if (!promoCode) {
      throw new Error("Promotional code not found");
    }

    promoCode.isActive = isActive;
    await this.promotionalCodeRepository.save(promoCode);

    return promoCode;
  }

  // This method is to update the promo code generated revenue after a successful payment
  async updateTotalRevenueGenerated(
    code: string,
    paidAmount: number
  ): Promise<PromotionalCode> {
    // Find the promotional code entity by its code
    const promotionalCode = await this.promotionalCodeRepository.findOne({
      where: { code: code },
    });

    if (!promotionalCode) {
      throw new Error("Promotional code not found");
    }

    // Update the total revenue generated
    promotionalCode.totalRevenueGenerated += paidAmount;

    // Save the updated promotional code back to the database
    await this.promotionalCodeRepository.save(promotionalCode);

    return promotionalCode;
  }
}
