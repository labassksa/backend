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
    // Extract nationalId along with marketer-specific data
    const {
      iban,
      organizationName,
      organizationIban,
      nationalId,
      ...userData
    } = marketerUserData;

    // Prepare userData without nationalId initially
    const preparedUserData: Partial<User> = {
      ...userData,
      phoneNumber: userData.phoneNumber, // Assuming phoneNumber is handled separately or doesn't require special handling
    };

    // Only re-attach nationalId to userData if it's not an empty string
    if (nationalId && nationalId !== "") {
      preparedUserData.nationalId = nationalId;
    }
    // Create a new User instance for the marketer with the role 'marketer' and additional user data
    const user = await this.userService.createPartialUser(
      Roles.Marketer,
      marketerUserData.phoneNumber,
      preparedUserData
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
    const marketerProfile = this.marketerProfileRepository.findOne({
      where: { id: marketerId },
      relations: [
        "user",
        "promotionalCodes",
        "promotionalCodes.marketerProfile",
      ],
    });
    if (!marketerProfile) {
      throw new Error("MarketerProfile not found");
    }
    return marketerProfile;
  }

  //All marketers, for admin access
  async getAllMarketerProfilesWithUserDetails(): Promise<MarketerProfile[]> {
    return this.marketerProfileRepository.find({
      relations: [
        "user",
        "promotionalCodes",
        "promotionalCodes.marketerProfile",
      ],
    });
  }
  // Include other operations related to marketers as needed
}
