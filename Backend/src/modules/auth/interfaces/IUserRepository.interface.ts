import { IUserDocument } from '../models/User.model';

export interface IUserRepository {
  findById(id: string): Promise<IUserDocument | null>;
  findByEmail(email: string): Promise<IUserDocument | null>;
  create(userData: Partial<IUserDocument>): Promise<IUserDocument>;
  update(id: string, updateData: Partial<IUserDocument>): Promise<IUserDocument | null>;
  delete(id: string): Promise<boolean>;
}

export default IUserRepository;
