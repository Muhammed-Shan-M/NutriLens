export interface DashboardResponseDto {
  userSummary: {
    fullName: string;
    goal: string;
    activityLevel: string;
  };
  nutritionSummary: {
    calories: { target: number; consumed: number; remaining: number };
    protein: { target: number; consumed: number; remaining: number };
    carbohydrates: { target: number; consumed: number; remaining: number };
    fat: { target: number; consumed: number; remaining: number };
    sugar: { consumed: number };
  };
  progress: {
    calories: number; // 0-100
    protein: number; // 0-100
    carbohydrates: number; // 0-100
    fat: number; // 0-100
  };
  todayMeals: Array<{
    id: string;
    imageUrl: string;
    mealName: string;
    mealType: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    sugar: number;
    time: string;
    createdAt: Date;
  }>;
  healthSummary: {
    bmi: number;
    bmiCategory: string;
    goal: string;
    activityLevel: string;
  };
}
