export interface DetectedFood {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface MealResponseDto {
  id: string;
  userId: string;
  imageUrl: string;
  mealName: string;
  mealType: string;
  detectedFoods: DetectedFood[];
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
  createdAt: string;
}
