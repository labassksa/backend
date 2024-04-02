import { User } from "../models/User";
import AppDataSource from "../../configuration/ormconfig";
import { injectable } from "tsyringe";

@injectable()
export class UserService {
  private readonly userRepository = AppDataSource.getRepository(User);
  constructor() {}

  async createPartialUser(phoneNumber: string, role: string): Promise<User> {
    const user = this.userRepository.create({ phoneNumber, role });
    await this.userRepository.save(user);
    return user;
  }

  async createDependentUser(dependentUserInfo: Partial<User>): Promise<User> {
    try {
      // Create a new user instance with the provided information
      const newUser = this.userRepository.create({ ...dependentUserInfo });

      // Persist the new user instance to the database
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error: any) {
      // Change the catch clause to handle any type
      console.error("Failed to create dependent user:", error);

      // Check if error is an instance of QueryFailedError and it is a unique constraint violation
      if (
        error.name === "QueryFailedError" &&
        error.driverError &&
        error.driverError.code === "23505"
      ) {
        // You can customize the error message by checking the fields in 'error.driverError.detail'
        if (error.driverError.detail.includes("phoneNumber")) {
          throw new Error(
            "Failed to create dependent user: phone number already exists."
          );
        }
        if (error.driverError.detail.includes("nationalId")) {
          throw new Error(
            "Failed to create dependent user: national ID already exists."
          );
        }
      }

      // For other errors, rethrow the generic error
      throw new Error(`Failed to create dependent user. ${error}`);
    }
  }

  // In recent versions of TypeORM, the findOne method's signature was updated, and it now expects an object with options for the query,
  // including conditions on which to find the entity, rather than directly passing the ID as a single argument.

  async findUserById(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error("User not found.");
      }
      return user;
    } catch (error) {
      // Handle or log the error as appropriate
      console.error(`An error occurred while finding user by ID: ${error}`);
      throw error; // Rethrow the error if you want calling code to handle it
    }
  }

  async checkUserInfo(userId: number): Promise<boolean> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error("User not found.");
      }
      const isComplete = !!(
        user.gender &&
        user.firstName &&
        user.lastName &&
        user.nationalId &&
        user.dateOfBirth
      );
      return isComplete;
    } catch (error: any) {
      // Handle or log the error as appropriate

      // Check if error is an instance of QueryFailedError and it is a unique constraint violation
      if (
        error.name === "QueryFailedError" &&
        error.driverError &&
        error.driverError.code === "23505"
      ) {
        // You can customize the error message by checking the fields in 'error.driverError.detail'
        if (error.driverError.detail.includes("phoneNumber")) {
          throw new Error(
            "Failed to create dependent user: phone number already exists."
          );
        }
        if (error.driverError.detail.includes("nationalId")) {
          throw new Error(
            "Failed to create dependent user: national ID already exists."
          );
        }
      }
      console.error(`An error occurred while finding user by ID: ${error}`);
      throw error; // Rethrow the error if you want calling code to handle it
    }
  }

  async completeUserInfo(user: User, userInfo: Partial<User>): Promise<User> {
    try {
      // create and save patient profile for the user

      // update the user record
      const updatedUser = await this.updateUser(user.id, userInfo);
      if (!updatedUser) {
        throw new Error("User Can not be updated");
      }
      return updatedUser;
    } catch (error: any) {
      console.error("Failed to fill user info", error);
      // Check if error is an instance of QueryFailedError and it is a unique constraint violation
      throw new Error("Failed to update user info");
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, userData);
    return this.findUserById(id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phoneNumber } });
  }
}
