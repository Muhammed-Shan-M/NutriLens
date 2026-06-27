import { Schema, model, Document } from 'mongoose';
import { UserRole, ActivityLevel, FitnessGoal } from '../../../shared/enums';

export interface IUserDocument extends Document {
  fullName: string;
  name: string; // Mongoose alias
  email: string;
  password?: string;
  role: UserRole;
  isOnboarded: boolean;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number; // in kg
  height?: number; // in cm
  activityLevel?: ActivityLevel;
  fitnessGoal?: FitnessGoal;
  goal?: string;
  bmi?: number;
  bmiCategory?: string;
  bmr?: number;
  tdee?: number;
  dailyCalories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      alias: 'name',
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
      min: [12, 'Age must be at least 12'],
      max: [120, 'Age cannot exceed 120'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    weight: {
      type: Number,
      min: [30, 'Weight must be at least 30kg'],
    },
    height: {
      type: Number,
      min: [100, 'Height must be at least 100cm'],
    },
    activityLevel: {
      type: String,
      enum: Object.values(ActivityLevel),
    },
    fitnessGoal: {
      type: String,
      enum: Object.values(FitnessGoal),
    },
    goal: {
      type: String,
    },
    bmi: {
      type: Number,
    },
    bmiCategory: {
      type: String,
    },
    bmr: {
      type: Number,
    },
    tdee: {
      type: Number,
    },
    dailyCalories: {
      type: Number,
    },
    protein: {
      type: Number,
    },
    carbs: {
      type: Number,
    },
    fat: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Do not include password in JSON outputs
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    const userObj = ret as unknown as Record<string, unknown>;
    delete userObj.password;
    delete userObj.__v;
    return userObj;
  },
});

export const UserModel = model<IUserDocument>('User', UserSchema);
export default UserModel;
