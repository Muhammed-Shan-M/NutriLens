import mongoose, { Document, Schema } from 'mongoose';
import { MealType } from '../../../shared/enums';

export interface IDetectedFood {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface IMealDocument extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  cloudinaryPublicId: string;
  mealName: string;
  mealType: MealType;
  detectedFoods: IDetectedFood[];
  totalCalories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  confidence: number;
  aiProvider: string;
  aiModel: string;
  rawAiResponse: string;
  consumedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DetectedFoodSchema = new Schema<IDetectedFood>(
  {
    name: { type: String, required: true },
    quantity: { type: String, default: 'unknown' },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
  { _id: false }
);

const MealSchema = new Schema<IMealDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    imageUrl: { type: String, required: false, default: '' },
    cloudinaryPublicId: { type: String, required: false, default: '' },
    mealName: { type: String, required: true },
    mealType: { type: String, enum: Object.values(MealType), default: MealType.SNACK },
    detectedFoods: { type: [DetectedFoodSchema], default: [] },
    totalCalories: { type: Number, required: true, default: 0 },
    protein: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    confidence: { type: Number, default: 0, min: 0, max: 1 },
    aiProvider: { type: String, default: 'none' },
    aiModel: { type: String, default: 'none' },
    rawAiResponse: { type: String, default: '' },
    consumedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MealModel = mongoose.model<IMealDocument>('Meal', MealSchema);
export default MealModel;
