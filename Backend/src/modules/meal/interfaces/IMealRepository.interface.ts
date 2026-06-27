import { IMealDocument } from '../models/Meal.model';

export interface IMealRepository {
  create(data: Partial<IMealDocument>): Promise<IMealDocument>;
  findById(id: string): Promise<IMealDocument | null>;
  findByUserId(userId: string, limit?: number): Promise<IMealDocument[]>;
  findTodayByUserId(userId: string): Promise<IMealDocument[]>;
  update(id: string, data: Partial<IMealDocument>): Promise<IMealDocument | null>;
  delete(id: string): Promise<void>;
}
