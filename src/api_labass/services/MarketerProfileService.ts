import { injectable, inject } from "tsyringe";
import AppDataSource from "../../configuration/ormconfig";
import { Roles } from "../../types/roles";
import { MarketerProfile } from "../models/Marketer";
import { User } from "../models/User";
import { UserService } from "./UserService";

@injectable()
export class MarketerProfileService {
  private readonly marketerProfileRepository =
    AppDataSource.getRepository(MarketerProfile);

  constructor(@inject(UserService) private userService: UserService) {}

  async createMarketer(
    marketerUserData: Partial<User> & {
      iban?: string;
      organizationName?: string;
      organizationIban?: string;
    }
  ): Promise<MarketerProfile> {
    // Extract marketer-specific data that shouldn't go into the user table
    const { iban, organizationName, organizationIban, ...userData } =
      marketerUserData;

    // Create a new User instance for the marketer with the role 'marketer' and additional user data
    const user = await this.userService.createPartialUser(
      Roles.Marketer,
      marketerUserData.phoneNumber,
      userData
    );
    // Create a new MarketerProfile linked to the User
    const marketerProfile = this.marketerProfileRepository.create({
      user,
      iban,
      organizationName,
      organizationIban,
    });
    await this.marketerProfileRepository.save(marketerProfile);

    return marketerProfile;
  }

  // fetch a marketer profile by marketer ID
  async getMarketerProfileByMarketerId(
    marketerId: number
  ): Promise<MarketerProfile> {
    const marketerProfile = await this.marketerProfileRepository.findOneBy({
      id: marketerId,
    });
    if (!marketerProfile) {
      throw new Error("MarketerProfile not found");
    }
    return marketerProfile;
  }

  async getMarketerProfileByIdWithPromotionalCodes(
    marketerId: number
  ): Promise<MarketerProfile | null> {
    return this.marketerProfileRepository.findOne({
      where: { id: marketerId },
      relations: ["user", "promotionalCodes"],
    });
  }

  async getAllMarketerProfilesWithUserDetails(): Promise<MarketerProfile[]> {
    return this.marketerProfileRepository.find({
      relations: ["user", "promotionalCodes"],
    });
  }
  // Include other operations related to marketers as needed
}
