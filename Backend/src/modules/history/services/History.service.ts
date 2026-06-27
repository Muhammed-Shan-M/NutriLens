import { HistoryRepository, HistoryQueryOptions } from '../repositories/History.repository';
import { HistoryResponseDto } from '../dtos/History.dto';
import { MealType } from '../../../shared/enums';

export class HistoryService {
  constructor(private readonly historyRepository: HistoryRepository) {}

  async getHistory(
    userId: string,
    query: {
      page?: string;
      limit?: string;
      search?: string;
      type?: string;
      dateRange?: string;
      sort?: string;
    }
  ): Promise<HistoryResponseDto> {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.max(1, parseInt(query.limit || '8', 10));
    const skip = (page - 1) * limit;

    let sortField = 'createdAt';
    let sortOrder: 1 | -1 = -1;

    switch (query.sort) {
      case 'oldest':
        sortOrder = 1;
        break;
      case 'calories_high':
        sortField = 'totalCalories';
        sortOrder = -1;
        break;
      case 'calories_low':
        sortField = 'totalCalories';
        sortOrder = 1;
        break;
      case 'newest':
      default:
        sortOrder = -1;
        break;
    }

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    const now = new Date();
    if (query.dateRange === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (query.dateRange === '7days') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (query.dateRange === '30days') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
    }

    const options: HistoryQueryOptions = {
      userId,
      limit,
      skip,
      sortField,
      sortOrder,
      search: query.search,
      type: query.type,
      startDate,
      endDate,
    };

    const { data, total } = await this.historyRepository.findPaginatedMeals(options);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map(meal => ({
        id: meal._id.toString(),
        mealName: meal.mealName,
        mealType: meal.mealType,
        imageUrl: meal.imageUrl,
        calories: meal.totalCalories,
        protein: meal.protein,
        carbohydrates: meal.carbohydrates,
        fat: meal.fat,
        sugar: meal.sugar,
        fiber: meal.fiber,
        sodium: meal.sodium,
        confidence: meal.confidence,
        detectedFoods: meal.detectedFoods.map(df => ({
          name: df.name,
          quantity: df.quantity,
          calories: df.calories,
        })),
        createdAt: meal.createdAt,
        time: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(meal.createdAt),
        date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(meal.createdAt),
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalMeals: total,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
