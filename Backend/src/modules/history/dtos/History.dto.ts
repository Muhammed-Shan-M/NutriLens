export interface MealHistoryItemDto {
  id: string;
  mealName: string;
  mealType: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  sugar: number;
  fiber: number;
  sodium: number;
  confidence: number;
  detectedFoods: Array<{ name: string; quantity: string; calories: number }>;
  createdAt: Date;
  time: string;
  date: string;
}

export interface PaginationDto {
  currentPage: number;
  totalPages: number;
  totalMeals: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface HistoryResponseDto {
  data: MealHistoryItemDto[];
  pagination: PaginationDto;
}
