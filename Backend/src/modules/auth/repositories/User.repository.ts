import { IUserRepository } from '../interfaces/IUserRepository.interface';
import { UserModel, IUserDocument } from '../models/User.model';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email }).exec();
  }

  async create(userData: Partial<IUserDocument>): Promise<IUserDocument> {
    const user = new UserModel(userData);
    return user.save();
  }

  async update(id: string, updateData: Partial<IUserDocument>): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}

export default UserRepository;
