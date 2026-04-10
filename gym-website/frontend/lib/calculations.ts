// Fitness calculation utilities - BMR, TDEE, macros, BMI

// Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
export const calculateBMR = (
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: string
): number => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
};

// Activity level multipliers for TDEE
export const activityMultipliers: Record<string, { multiplier: number; label: string; description: string }> = {
  sedentary: { multiplier: 1.2, label: 'Sedentary', description: 'Little or no exercise' },
  lightly_active: { multiplier: 1.375, label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  moderately_active: { multiplier: 1.55, label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  very_active: { multiplier: 1.725, label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  extremely_active: { multiplier: 1.9, label: 'Extremely Active', description: 'Very hard exercise & physical job' },
};

// Calculate Total Daily Energy Expenditure
export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const { multiplier } = activityMultipliers[activityLevel] || { multiplier: 1.55 };
  return Math.round(bmr * multiplier);
};

// Calculate target calories based on fitness goal
export const calculateTargetCalories = (
  tdee: number,
  goal: string
): { calories: number; description: string } => {
  switch (goal) {
    case 'lose_weight':
      return {
        calories: tdee - 500,
        description: '500 calorie deficit for ~0.5kg/week fat loss',
      };
    case 'gain_muscle':
      return {
        calories: tdee + 300,
        description: '300 calorie surplus for lean muscle gain',
      };
    default:
      return {
        calories: tdee,
        description: 'Maintenance calories to sustain current weight',
      };
  }
};

// Calculate macronutrient breakdown in grams
export const calculateMacros = (
  targetCalories: number,
  goal: string
): { protein: number; carbs: number; fats: number; proteinPct: number; carbsPct: number; fatsPct: number } => {
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

  return {
    protein: Math.round((targetCalories * proteinPct) / 4), // 4 cal/g
    carbs: Math.round((targetCalories * carbsPct) / 4),     // 4 cal/g
    fats: Math.round((targetCalories * fatsPct) / 9),       // 9 cal/g
    proteinPct: Math.round(proteinPct * 100),
    carbsPct: Math.round(carbsPct * 100),
    fatsPct: Math.round(fatsPct * 100),
  };
};

// Calculate BMI and return category
export const calculateBMI = (
  weightKg: number,
  heightCm: number
): { bmi: number; category: string; color: string; recommendation: string } => {
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  if (bmi < 18.5) {
    return { bmi, category: 'Underweight', color: '#60a5fa', recommendation: 'Focus on nutritious foods and strength training to gain healthy weight.' };
  } else if (bmi < 25) {
    return { bmi, category: 'Normal Weight', color: '#34d399', recommendation: 'Great! Maintain your healthy lifestyle with regular exercise and balanced nutrition.' };
  } else if (bmi < 30) {
    return { bmi, category: 'Overweight', color: '#fbbf24', recommendation: 'Consider a moderate calorie deficit and increase physical activity levels.' };
  } else {
    return { bmi, category: 'Obese', color: '#f87171', recommendation: 'Consult a healthcare provider for personalized weight management advice.' };
  }
};

// Convert pounds to kilograms
export const lbsToKg = (lbs: number): number => Math.round(lbs * 0.453592 * 10) / 10;

// Convert inches to centimeters
export const inchesToCm = (inches: number): number => Math.round(inches * 2.54 * 10) / 10;

// Calculate recommended water intake
export const calculateWaterIntake = (weightKg: number): number =>
  Math.round(weightKg * 0.033 * 10) / 10;

// Format calorie number with comma separator
export const formatCalories = (calories: number): string =>
  calories.toLocaleString();
