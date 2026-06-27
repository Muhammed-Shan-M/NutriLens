export interface CaloriesChartDto {
  date: string;
  calories: number;
}

export interface MacroChartDto {
  date: string;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface NutritionSummaryDto {
  averageCalories: number;
  averageProtein: number;
  averageCarbohydrates: number;
  averageFat: number;
  averageSugar: number;
  averageFiber: number;
  averageSodium: number;
  averageMealsPerDay: number;
}

export interface MealDistributionDto {
  breakfast: number;
  lunch: number;
  dinner: number;
  snack: number;
}

export interface CaloriesByMealTypeDto {
  name: string;
  calories: number;
}

export interface GoalProgressDto {
  daysMet: number;
  totalDays: number;
  percentage: number;
}

export interface TrendDto {
  totalMeals: number;
  totalCalories: number;
  highestCalorieDay: { date: string; calories: number } | null;
  lowestCalorieDay: { date: string; calories: number } | null;
  currentStreak: number;
  longestStreak: number;
}

export interface AnalyticsResponseDto {
  period: string;
  dailyCalories: CaloriesChartDto[];
  macronutrientTrend: MacroChartDto[];
  macronutrientTotals: { protein: number; carbohydrates: number; fat: number };
  nutritionSummary: NutritionSummaryDto;
  mealDistribution: MealDistributionDto;
  caloriesByMealType: CaloriesByMealTypeDto[];
  goalProgress: GoalProgressDto;
  trends: TrendDto;
}

export interface AnalyticsInsightResponseDto {
  insight: string;
}
