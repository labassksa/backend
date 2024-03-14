import { getRepository } from "typeorm";
import { User } from "../models/user";
import AppDataSource from "../../configuration/ormconfig";
import { injectable } from "tsyringe";

@injectable()
export class UserService {
  private readonly userRepository = AppDataSource.getRepository(User);

  async createUser(phoneNumber: string, role: string): Promise<User> {
    const user = this.userRepository.create({ phoneNumber, role });
    await this.userRepository.save(user);
    return user;
  }

  // In recent versions of TypeORM, the findOne method's signature was updated, and it now expects an object with options for the query,
  // including conditions on which to find the entity, rather than directly passing the ID as a single argument.
  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
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
