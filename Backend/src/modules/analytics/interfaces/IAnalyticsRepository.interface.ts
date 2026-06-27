export interface DailyAggregationResult {
  _id: string; // YYYY-MM-DD format
  totalCalories: number;
  totalProtein: number;
  totalCarbohydrates: number;
  totalFat: number;
  totalSugar: number;
  totalFiber: number;
  totalSodium: number;
  mealCount: number;
}

export interface MealDistributionResult {
  _id: string; // mealType (breakfast, lunch, dinner, snack)
  count: number;
  totalCalories: number;
}

export interface IAnalyticsRepository {
  getDailyAggregations(userId: string, startDate: Date, endDate: Date): Promise<DailyAggregationResult[]>;
  getMealDistribution(userId: string, startDate: Date, endDate: Date): Promise<MealDistributionResult[]>;
  getAllTrackingDates(userId: string): Promise<{ _id: string }[]>; // To calculate streaks over all time
}
