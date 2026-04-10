import { Request, Response, NextFunction } from 'express';

// Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
const calculateBMR = (
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: string
): number => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Activity level multipliers for TDEE calculation
const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,           // Little or no exercise
  lightly_active: 1.375,    // Light exercise 1-3 days/week
  moderately_active: 1.55,  // Moderate exercise 3-5 days/week
  very_active: 1.725,       // Hard exercise 6-7 days/week
  extremely_active: 1.9,    // Very hard exercise, physical job
};

// POST /api/calculator/tdee - Calculate Total Daily Energy Expenditure
export const calculateTDEE = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { age, height, weight, gender, activityLevel, goal, heightUnit, weightUnit } = req.body;

    // Convert units if needed
    let weightKg = weight;
    let heightCm = height;

    if (weightUnit === 'lbs') {
      weightKg = weight * 0.453592;
    }
    if (heightUnit === 'inches') {
      heightCm = height * 2.54;
    }

    // Calculate BMR
    const bmr = calculateBMR(weightKg, heightCm, age, gender);

    // Calculate TDEE (Total Daily Energy Expenditure)
    const multiplier = activityMultipliers[activityLevel] || 1.55;
    let tdee = Math.round(bmr * multiplier);

    // Adjust TDEE based on goal
    let targetCalories = tdee;
    let goalDescription = '';

    switch (goal) {
      case 'lose_weight':
        targetCalories = tdee - 500; // 500 calorie deficit for ~0.5kg/week loss
        goalDescription = 'Calorie deficit for gradual fat loss';
        break;
      case 'gain_muscle':
        targetCalories = tdee + 300; // 300 calorie surplus for lean muscle gain
        goalDescription = 'Calorie surplus for lean muscle building';
        break;
      case 'maintenance':
        targetCalories = tdee;
        goalDescription = 'Maintenance calories to sustain current weight';
        break;
    }

    // Calculate macronutrient distribution
    let proteinPct: number, carbsPct: number, fatsPct: number;

    switch (goal) {
      case 'gain_muscle':
        proteinPct = 0.30; carbsPct = 0.45; fatsPct = 0.25;
        break;
      case 'lose_weight':
        proteinPct = 0.35; carbsPct = 0.35; fatsPct = 0.30;
        break;
      default:
        proteinPct = 0.25; carbsPct = 0.50; fatsPct = 0.25;
    }

    const proteinGrams = Math.round((targetCalories * proteinPct) / 4); // 4 cal/g
    const carbsGrams = Math.round((targetCalories * carbsPct) / 4);     // 4 cal/g
    const fatsGrams = Math.round((targetCalories * fatsPct) / 9);       // 9 cal/g

    // Calculate BMI
    const heightM = heightCm / 100;
    const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

    let bmiCategory: string;
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal weight';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';

    // Suggest diet plan type
    const suggestedDietType = goal === 'lose_weight' ? 'weight_loss'
      : goal === 'gain_muscle' ? 'muscle_gain'
      : 'maintenance';

    res.status(200).json({
      success: true,
      data: {
        bmr: Math.round(bmr),
        tdee,
        targetCalories,
        goalDescription,
        macros: {
          protein: { grams: proteinGrams, percentage: Math.round(proteinPct * 100) },
          carbs: { grams: carbsGrams, percentage: Math.round(carbsPct * 100) },
          fats: { grams: fatsGrams, percentage: Math.round(fatsPct * 100) },
        },
        bmi,
        bmiCategory,
        suggestedDietType,
        waterIntake: Math.round(weightKg * 0.033 * 10) / 10, // Liters per day
        proteinPerKg: Math.round((proteinGrams / weightKg) * 10) / 10,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/calculator/bmi - Quick BMI calculation
export const calculateBMI = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { height, weight, heightUnit, weightUnit } = req.body;

    let weightKg = weight;
    let heightCm = height;

    if (weightUnit === 'lbs') weightKg = weight * 0.453592;
    if (heightUnit === 'inches') heightCm = height * 2.54;

    const heightM = heightCm / 100;
    const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

    let category: string;
    let healthRisk: string;
    let recommendation: string;

    if (bmi < 18.5) {
      category = 'Underweight';
      healthRisk = 'Moderate';
      recommendation = 'Focus on gaining weight through nutritious foods and strength training.';
    } else if (bmi < 25) {
      category = 'Normal weight';
      healthRisk = 'Low';
      recommendation = 'Maintain your healthy lifestyle with regular exercise and balanced nutrition.';
    } else if (bmi < 30) {
      category = 'Overweight';
      healthRisk = 'Moderate';
      recommendation = 'Consider a moderate calorie deficit and increase physical activity.';
    } else {
      category = 'Obese';
      healthRisk = 'High';
      recommendation = 'Consult a healthcare provider for personalized weight management advice.';
    }

    res.status(200).json({
      success: true,
      data: { bmi, category, healthRisk, recommendation },
    });
  } catch (error) {
    next(error);
  }
};
