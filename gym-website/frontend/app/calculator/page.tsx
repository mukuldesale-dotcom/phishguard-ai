'use client';

// Smart Fitness Calculator - TDEE, BMI, and macro calculations
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Calculator, ChevronDown, Info, Droplets, Flame, Scale } from 'lucide-react';
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
  calculateBMI,
  lbsToKg,
  inchesToCm,
  calculateWaterIntake,
} from '@/lib/calculations';

// Form input types
interface CalculatorForm {
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female';
  activityLevel: string;
  goal: string;
  heightUnit: 'cm' | 'inches';
  weightUnit: 'kg' | 'lbs';
}

// Activity level options
const activityOptions = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3x/week' },
  { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5x/week' },
  { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7x/week' },
  { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise + physical job' },
];

// Goal options
const goalOptions = [
  { value: 'lose_weight', label: 'Lose Weight', emoji: '🔥', description: '-500 cal deficit' },
  { value: 'maintenance', label: 'Maintenance', emoji: '⚖️', description: 'TDEE calories' },
  { value: 'gain_muscle', label: 'Gain Muscle', emoji: '💪', description: '+300 cal surplus' },
];

// Results interface
interface CalculatorResults {
  bmr: number;
  tdee: number;
  targetCalories: number;
  goalDescription: string;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    proteinPct: number;
    carbsPct: number;
    fatsPct: number;
  };
  bmi: { bmi: number; category: string; color: string; recommendation: string };
  waterIntake: number;
  weightKg: number;
}

// Macro progress bar component
function MacroBar({ label, grams, percentage, color }: {
  label: string;
  grams: number;
  percentage: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-semibold">{grams}g <span className="text-gray-500">({percentage}%)</span></span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CalculatorForm>({
    defaultValues: {
      gender: 'male',
      activityLevel: 'moderately_active',
      goal: 'maintenance',
      heightUnit: 'cm',
      weightUnit: 'kg',
    },
  });

  const heightUnit = watch('heightUnit');
  const weightUnit = watch('weightUnit');

  // Calculate results when form is submitted
  const onSubmit = (data: CalculatorForm) => {
    setIsCalculating(true);

    // Convert units if needed
    const weightKg = data.weightUnit === 'lbs' ? lbsToKg(data.weight) : data.weight;
    const heightCm = data.heightUnit === 'inches' ? inchesToCm(data.height) : data.height;

    // Perform calculations
    const bmr = calculateBMR(weightKg, heightCm, data.age, data.gender);
    const tdee = calculateTDEE(bmr, data.activityLevel);
    const { calories: targetCalories, description: goalDescription } = calculateTargetCalories(tdee, data.goal);
    const macros = calculateMacros(targetCalories, data.goal);
    const bmi = calculateBMI(weightKg, heightCm);
    const waterIntake = calculateWaterIntake(weightKg);

    setTimeout(() => {
      setResults({
        bmr: Math.round(bmr),
        tdee,
        targetCalories,
        goalDescription,
        macros,
        bmi,
        waterIntake,
        weightKg,
      });
      setIsCalculating(false);
    }, 800); // Slight delay for UX
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Page Header */}
      <section className="py-16 border-b border-gray-800 bg-gradient-to-b from-amber-950/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm">Smart Fitness Calculator</span>
            </div>
            <h1 className="section-title">Calculate Your Macros</h1>
            <p className="section-subtitle">
              Get personalized calorie targets, macro breakdown, and diet recommendations based on your body stats and goals.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ===== CALCULATOR FORM ===== */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Stats</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Age */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  {...register('age', { required: true, min: 13, max: 120 })}
                  placeholder="Enter your age"
                  className="input-gold"
                />
                {errors.age && <p className="text-red-400 text-xs mt-1">Age must be between 13-120</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {['male', 'female'].map((g) => (
                    <label
                      key={g}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        watch('gender') === g
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <input type="radio" value={g} {...register('gender')} className="hidden" />
                      {g === 'male' ? '👨' : '👩'}
                      <span className="capitalize font-medium">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-400 text-sm font-medium">Height</label>
                  <div className="flex gap-2">
                    {['cm', 'inches'].map((unit) => (
                      <label key={unit} className={`text-xs px-2 py-1 rounded cursor-pointer border transition-all ${
                        heightUnit === unit ? 'border-amber-500 text-amber-400' : 'border-gray-700 text-gray-400'
                      }`}>
                        <input type="radio" value={unit} {...register('heightUnit')} className="hidden" />
                        {unit}
                      </label>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  {...register('height', { required: true, min: 50 })}
                  placeholder={heightUnit === 'cm' ? 'e.g. 175' : 'e.g. 69'}
                  className="input-gold"
                />
              </div>

              {/* Weight */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-400 text-sm font-medium">Weight</label>
                  <div className="flex gap-2">
                    {['kg', 'lbs'].map((unit) => (
                      <label key={unit} className={`text-xs px-2 py-1 rounded cursor-pointer border transition-all ${
                        weightUnit === unit ? 'border-amber-500 text-amber-400' : 'border-gray-700 text-gray-400'
                      }`}>
                        <input type="radio" value={unit} {...register('weightUnit')} className="hidden" />
                        {unit}
                      </label>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  {...register('weight', { required: true, min: 20 })}
                  placeholder={weightUnit === 'kg' ? 'e.g. 75' : 'e.g. 165'}
                  className="input-gold"
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Activity Level</label>
                <div className="relative">
                  <select {...register('activityLevel')} className="input-gold appearance-none pr-10">
                    {activityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} — {opt.description}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Your Goal</label>
                <div className="grid grid-cols-3 gap-3">
                  {goalOptions.map((g) => (
                    <label
                      key={g.value}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border cursor-pointer transition-all text-center ${
                        watch('goal') === g.value
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <input type="radio" value={g.value} {...register('goal')} className="hidden" />
                      <span className="text-2xl">{g.emoji}</span>
                      <span className={`text-xs font-medium ${watch('goal') === g.value ? 'text-amber-400' : 'text-gray-400'}`}>
                        {g.label}
                      </span>
                      <span className="text-xs text-gray-500">{g.description}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                className="btn-gold w-full text-base py-4 flex items-center justify-center gap-2"
                disabled={isCalculating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCalculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Calculate My Plan
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* ===== RESULTS PANEL ===== */}
          <div>
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white">Your Results</h2>

                  {/* Main calorie cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-premium text-center">
                      <div className="text-gray-400 text-xs mb-1">BMR (Base Metabolism)</div>
                      <div className="text-3xl font-black text-white">
                        {results.bmr.toLocaleString()}
                      </div>
                      <div className="text-amber-400 text-xs mt-1">calories/day</div>
                    </div>
                    <div className="card-premium text-center">
                      <div className="text-gray-400 text-xs mb-1">TDEE (Total Expenditure)</div>
                      <div className="text-3xl font-black text-white">
                        {results.tdee.toLocaleString()}
                      </div>
                      <div className="text-amber-400 text-xs mt-1">calories/day</div>
                    </div>
                  </div>

                  {/* Target calories */}
                  <div className="bg-gradient-to-r from-amber-900/30 to-transparent border border-amber-500/40 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-5 h-5 text-amber-400" />
                      <span className="text-amber-400 font-semibold">Target Calories</span>
                    </div>
                    <div className="text-5xl font-black text-white mb-1">
                      {results.targetCalories.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">{results.goalDescription}</div>
                  </div>

                  {/* Macros breakdown */}
                  <div className="card-premium">
                    <h3 className="text-white font-semibold mb-4">Daily Macros</h3>
                    <div className="space-y-4">
                      <MacroBar
                        label="Protein"
                        grams={results.macros.protein}
                        percentage={results.macros.proteinPct}
                        color="bg-blue-500"
                      />
                      <MacroBar
                        label="Carbohydrates"
                        grams={results.macros.carbs}
                        percentage={results.macros.carbsPct}
                        color="bg-amber-500"
                      />
                      <MacroBar
                        label="Fats"
                        grams={results.macros.fats}
                        percentage={results.macros.fatsPct}
                        color="bg-green-500"
                      />
                    </div>
                  </div>

                  {/* BMI Card */}
                  <div className="card-premium">
                    <div className="flex items-center gap-2 mb-3">
                      <Scale className="w-5 h-5 text-amber-400" />
                      <h3 className="text-white font-semibold">BMI Analysis</h3>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-4xl font-black text-white">{results.bmi.bmi}</div>
                      <span
                        className="text-lg font-bold px-3 py-1 rounded-full"
                        style={{ color: results.bmi.color, backgroundColor: `${results.bmi.color}20` }}
                      >
                        {results.bmi.category}
                      </span>
                    </div>
                    {/* BMI scale */}
                    <div className="h-3 rounded-full overflow-hidden flex mb-2">
                      <div className="flex-1 bg-blue-500/60" />
                      <div className="flex-1 bg-green-500/60" />
                      <div className="flex-1 bg-yellow-500/60" />
                      <div className="flex-1 bg-red-500/60" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Underweight</span>
                      <span>Normal</span>
                      <span>Overweight</span>
                      <span>Obese</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">{results.bmi.recommendation}</p>
                  </div>

                  {/* Water intake */}
                  <div className="card-premium flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Daily Water Intake</div>
                      <div className="text-2xl font-bold text-white">{results.waterIntake}L</div>
                      <div className="text-gray-500 text-xs">Based on your body weight</div>
                    </div>
                  </div>

                  {/* Info note */}
                  <div className="flex items-start gap-2 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-400 text-xs leading-relaxed">
                      These calculations use the Mifflin-St Jeor equation for BMR estimation. Results are estimates.
                      Consult a healthcare professional for personalized medical nutrition advice.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-20"
                >
                  <div className="text-7xl mb-6">🧮</div>
                  <h3 className="text-xl font-bold text-white mb-2">Enter Your Stats</h3>
                  <p className="text-gray-400 max-w-xs">
                    Fill in the form and click Calculate to get your personalized nutrition plan.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
