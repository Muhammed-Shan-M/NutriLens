import { ActivityLevel, FitnessGoal } from '../enums';

export interface INutritionMetricsInput {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal | string;
}

export interface INutritionMetricsOutput {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export class NutritionCalculator {
  public static calculateMetrics(input: INutritionMetricsInput): INutritionMetricsOutput {
    const { age, gender, height, weight, activityLevel, goal } = input;

    // 1. BMI Calculation
    const heightInMeters = height / 100;
    const bmiRaw = weight / (heightInMeters * heightInMeters);
    const bmi = Math.round(bmiRaw * 10) / 10;

    // 2. BMI Category
    let bmiCategory = 'Normal Weight';
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25.0) {
      bmiCategory = 'Normal Weight';
    } else if (bmi >= 25.0 && bmi < 30.0) {
      bmiCategory = 'Overweight';
    } else {
      bmiCategory = 'Obese';
    }

    // 3. BMR Calculation (Mifflin-St Jeor)
    let bmr = 0;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else if (gender === 'female') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    } else {
      // Other: Average Male/Female formula offset
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 78;
    }
    bmr = Math.round(bmr);

    // 4. TDEE Calculation
    let activityMultiplier = 1.2;
    if (activityLevel === ActivityLevel.SEDENTARY) {
      activityMultiplier = 1.2;
    } else if (activityLevel === ActivityLevel.LIGHTLY_ACTIVE) {
      activityMultiplier = 1.375;
    } else if (activityLevel === ActivityLevel.MODERATELY_ACTIVE) {
      activityMultiplier = 1.55;
    } else if (activityLevel === ActivityLevel.VERY_ACTIVE) {
      activityMultiplier = 1.725;
    } else if (activityLevel === ActivityLevel.EXTRA_ACTIVE) {
      activityMultiplier = 1.9;
    }
    const tdee = Math.round(bmr * activityMultiplier);

    // 5. Daily Calories Goal Adjustment
    let dailyCalories = tdee;
    if (goal === FitnessGoal.LOSE_WEIGHT) {
      dailyCalories = tdee - 500;
    } else if (goal === FitnessGoal.GAIN_WEIGHT) {
      dailyCalories = tdee + 300;
    }
    // Impose healthy minimum daily caloric threshold
    dailyCalories = Math.max(1200, Math.round(dailyCalories));

    // 6. Protein Target (2g per kg of bodyweight)
    const protein = Math.round(2 * weight);

    // 7. Fat Target (25% of Daily Calories)
    const fat = Math.round((0.25 * dailyCalories) / 9);

    // 8. Carbohydrates Target (Remaining calories)
    const proteinCalories = protein * 4;
    const fatCalories = fat * 9;
    const carbs = Math.round(Math.max(0, (dailyCalories - proteinCalories - fatCalories) / 4));

    return {
      bmi,
      bmiCategory,
      bmr,
      tdee,
      dailyCalories,
      protein,
      carbs,
      fat,
    };
  }
}
