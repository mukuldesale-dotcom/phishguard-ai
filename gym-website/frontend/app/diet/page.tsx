'use client';

// Diet Plans page - Browse meal plans by fitness goal
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

// Diet plans data
const DIET_PLANS = [
  {
    id: '1',
    name: 'Fat Shredding Diet Plan',
    goal: 'weight_loss',
    goalLabel: 'Weight Loss',
    dailyCalories: 1800,
    macros: { protein: 35, carbs: 35, fats: 30 },
    difficulty: 'moderate',
    duration: '12 weeks',
    description: 'A strategic calorie deficit plan designed to maximize fat loss while preserving lean muscle mass.',
    emoji: '🔥',
    color: 'border-red-500/40',
    accentColor: 'text-red-400',
    bgColor: 'bg-red-500/5',
    tags: ['Fat Loss', 'High Protein', 'Low Carb'],
    meals: [
      {
        name: 'Breakfast',
        time: '7:00 AM',
        calories: 400,
        foods: [
          { name: 'Greek Yogurt', amount: '200g', calories: 130, protein: 17, carbs: 8, fats: 2 },
          { name: 'Mixed Berries', amount: '100g', calories: 50, protein: 1, carbs: 12, fats: 0 },
          { name: 'Whole Grain Toast', amount: '1 slice', calories: 80, protein: 3, carbs: 15, fats: 1 },
          { name: 'Egg Whites (3)', amount: '90g', calories: 52, protein: 11, carbs: 1, fats: 0 },
        ],
      },
      {
        name: 'Lunch',
        time: '1:00 PM',
        calories: 550,
        foods: [
          { name: 'Grilled Chicken Breast', amount: '180g', calories: 280, protein: 53, carbs: 0, fats: 6 },
          { name: 'Brown Rice', amount: '150g cooked', calories: 165, protein: 4, carbs: 35, fats: 1 },
          { name: 'Steamed Broccoli', amount: '200g', calories: 70, protein: 6, carbs: 14, fats: 1 },
        ],
      },
      {
        name: 'Dinner',
        time: '7:00 PM',
        calories: 500,
        foods: [
          { name: 'Baked Salmon', amount: '150g', calories: 280, protein: 39, carbs: 0, fats: 13 },
          { name: 'Sweet Potato', amount: '150g', calories: 130, protein: 3, carbs: 30, fats: 0 },
          { name: 'Mixed Green Salad', amount: '150g', calories: 25, protein: 2, carbs: 4, fats: 0 },
        ],
      },
      {
        name: 'Snacks',
        time: 'Between meals',
        calories: 350,
        foods: [
          { name: 'Almonds', amount: '20g', calories: 116, protein: 4, carbs: 4, fats: 10 },
          { name: 'Protein Shake', amount: '1 scoop', calories: 120, protein: 25, carbs: 3, fats: 2 },
          { name: 'Apple', amount: '1 medium', calories: 95, protein: 0, carbs: 25, fats: 0 },
        ],
      },
    ],
    benefits: [
      'Supports ~0.5kg/week fat loss',
      'Preserves lean muscle mass',
      'High satiety from protein',
      'Sustained energy levels',
    ],
  },
  {
    id: '2',
    name: 'Muscle Builder Diet Plan',
    goal: 'muscle_gain',
    goalLabel: 'Muscle Gain',
    dailyCalories: 3200,
    macros: { protein: 30, carbs: 45, fats: 25 },
    difficulty: 'moderate',
    duration: '16 weeks',
    description: 'High-calorie, protein-rich diet designed to support muscle hypertrophy and recovery.',
    emoji: '💪',
    color: 'border-amber-500/40',
    accentColor: 'text-amber-400',
    bgColor: 'bg-amber-500/5',
    tags: ['Muscle Gain', 'High Calorie', 'High Protein'],
    meals: [
      {
        name: 'Breakfast',
        time: '7:00 AM',
        calories: 700,
        foods: [
          { name: 'Oatmeal', amount: '100g dry', calories: 380, protein: 13, carbs: 66, fats: 7 },
          { name: 'Whole Eggs (3)', amount: '3 eggs', calories: 210, protein: 18, carbs: 1, fats: 15 },
          { name: 'Banana', amount: '1 large', calories: 121, protein: 1, carbs: 31, fats: 0 },
          { name: 'Whole Milk', amount: '200ml', calories: 122, protein: 6, carbs: 9, fats: 7 },
        ],
      },
      {
        name: 'Lunch',
        time: '1:00 PM',
        calories: 900,
        foods: [
          { name: 'Ground Beef (lean)', amount: '200g', calories: 440, protein: 46, carbs: 0, fats: 28 },
          { name: 'White Rice', amount: '250g cooked', calories: 325, protein: 6, carbs: 71, fats: 1 },
          { name: 'Mixed Vegetables', amount: '200g', calories: 80, protein: 5, carbs: 18, fats: 0 },
          { name: 'Avocado', amount: '50g', calories: 80, protein: 1, carbs: 4, fats: 7 },
        ],
      },
      {
        name: 'Dinner',
        time: '7:30 PM',
        calories: 750,
        foods: [
          { name: 'Chicken Breast', amount: '250g', calories: 385, protein: 72, carbs: 0, fats: 8 },
          { name: 'Sweet Potato', amount: '200g', calories: 172, protein: 4, carbs: 40, fats: 0 },
          { name: 'Broccoli & Asparagus', amount: '200g', calories: 70, protein: 7, carbs: 12, fats: 0 },
        ],
      },
      {
        name: 'Snacks',
        time: 'Pre/Post workout',
        calories: 850,
        foods: [
          { name: 'Mass Gainer Shake', amount: '1 serving', calories: 380, protein: 30, carbs: 50, fats: 8 },
          { name: 'Peanut Butter', amount: '2 tbsp', calories: 190, protein: 8, carbs: 6, fats: 16 },
          { name: 'Whole Wheat Pasta', amount: '80g dry', calories: 280, protein: 10, carbs: 56, fats: 2 },
        ],
      },
    ],
    benefits: [
      'Supports lean muscle gain',
      'Optimal protein for recovery',
      'Strategic calorie surplus',
      'Supports intense training',
    ],
  },
  {
    id: '3',
    name: 'Balanced Maintenance Plan',
    goal: 'maintenance',
    goalLabel: 'Maintenance',
    dailyCalories: 2400,
    macros: { protein: 25, carbs: 50, fats: 25 },
    difficulty: 'easy',
    duration: 'Ongoing',
    description: 'A well-balanced, sustainable diet to maintain your current weight and support overall health.',
    emoji: '⚖️',
    color: 'border-green-500/40',
    accentColor: 'text-green-400',
    bgColor: 'bg-green-500/5',
    tags: ['Maintenance', 'Balanced', 'Sustainable'],
    meals: [
      {
        name: 'Breakfast',
        time: '7:30 AM',
        calories: 500,
        foods: [
          { name: 'Whole Grain Cereal', amount: '60g', calories: 220, protein: 6, carbs: 46, fats: 2 },
          { name: 'Low-Fat Milk', amount: '250ml', calories: 110, protein: 9, carbs: 12, fats: 3 },
          { name: 'Scrambled Eggs', amount: '2 eggs', calories: 182, protein: 12, carbs: 1, fats: 14 },
          { name: 'Orange Juice', amount: '200ml', calories: 88, protein: 1, carbs: 21, fats: 0 },
        ],
      },
      {
        name: 'Lunch',
        time: '12:30 PM',
        calories: 700,
        foods: [
          { name: 'Turkey Sandwich', amount: '1 sandwich', calories: 380, protein: 28, carbs: 45, fats: 10 },
          { name: 'Mixed Fruit Salad', amount: '150g', calories: 90, protein: 1, carbs: 23, fats: 0 },
          { name: 'Low-fat Yogurt', amount: '150g', calories: 100, protein: 8, carbs: 15, fats: 2 },
        ],
      },
      {
        name: 'Dinner',
        time: '7:00 PM',
        calories: 700,
        foods: [
          { name: 'Baked Chicken Thighs', amount: '200g', calories: 310, protein: 40, carbs: 0, fats: 16 },
          { name: 'Roasted Vegetables', amount: '250g', calories: 150, protein: 5, carbs: 28, fats: 4 },
          { name: 'Quinoa', amount: '100g cooked', calories: 120, protein: 4, carbs: 21, fats: 2 },
        ],
      },
      {
        name: 'Snacks',
        time: 'Between meals',
        calories: 500,
        foods: [
          { name: 'Hummus & Crackers', amount: '60g + 30g', calories: 260, protein: 8, carbs: 34, fats: 11 },
          { name: 'Carrot & Celery', amount: '100g', calories: 40, protein: 1, carbs: 9, fats: 0 },
          { name: 'Mixed Nuts', amount: '30g', calories: 180, protein: 5, carbs: 6, fats: 16 },
        ],
      },
    ],
    benefits: [
      'Sustainable long-term',
      'Balanced macronutrients',
      'Supports energy levels',
      'Overall health optimization',
    ],
  },
];

type GoalFilter = 'all' | 'weight_loss' | 'muscle_gain' | 'maintenance';

export default function DietPage() {
  const [goalFilter, setGoalFilter] = useState<GoalFilter>('all');
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  const filteredPlans = DIET_PLANS.filter(
    (p) => goalFilter === 'all' || p.goal === goalFilter
  );

  return (
    <div className="pt-20 min-h-screen">
      {/* Page Header */}
      <section className="py-16 border-b border-gray-800 bg-gradient-to-b from-amber-950/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm">Nutrition Programs</span>
            </div>
            <h1 className="section-title">Diet Plans</h1>
            <p className="section-subtitle">
              Evidence-based nutrition programs designed to fuel your transformation
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Goal Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {[
            { value: 'all', label: 'All Plans', emoji: '🍽️' },
            { value: 'weight_loss', label: 'Weight Loss', emoji: '🔥' },
            { value: 'muscle_gain', label: 'Muscle Gain', emoji: '💪' },
            { value: 'maintenance', label: 'Maintenance', emoji: '⚖️' },
          ].map((g) => (
            <button
              key={g.value}
              onClick={() => setGoalFilter(g.value as GoalFilter)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all border ${
                goalFilter === g.value
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-transparent text-gray-400 border-gray-700 hover:border-amber-500/50 hover:text-white'
              }`}
            >
              <span>{g.emoji}</span>
              {g.label}
            </button>
          ))}
        </motion.div>

        {/* Diet Plan Cards */}
        <div className="space-y-8">
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-900/80 border ${plan.color} rounded-2xl overflow-hidden`}
            >
              {/* Plan Header */}
              <div className={`${plan.bgColor} p-8 border-b border-gray-800`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{plan.emoji}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-white font-bold text-2xl">{plan.name}</h2>
                        <span className={`text-xs px-2 py-1 rounded-full bg-gray-800 ${plan.accentColor}`}>
                          {plan.goalLabel}
                        </span>
                      </div>
                      <p className="text-gray-400 max-w-xl">{plan.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`text-3xl font-black ${plan.accentColor}`}>
                      {plan.dailyCalories.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">calories/day</div>
                    <div className="text-gray-400 text-sm">{plan.duration}</div>
                  </div>
                </div>

                {/* Macros breakdown */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { label: 'Protein', value: plan.macros.protein, color: 'bg-blue-500' },
                    { label: 'Carbs', value: plan.macros.carbs, color: 'bg-amber-500' },
                    { label: 'Fats', value: plan.macros.fats, color: 'bg-green-500' },
                  ].map((macro) => (
                    <div key={macro.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{macro.label}</span>
                        <span className="text-white font-semibold">{macro.value}%</span>
                      </div>
                      <div className="progress-gold">
                        <motion.div
                          className={`h-full ${macro.color} rounded-full`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${macro.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meals Section */}
              <div className="p-8">
                <h3 className="text-white font-bold text-xl mb-6">Daily Meal Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.meals.map((meal) => {
                    const mealKey = `${plan.id}-${meal.name}`;
                    const isExpanded = expandedMeal === mealKey;

                    return (
                      <div
                        key={meal.name}
                        className="bg-gray-800/50 rounded-xl overflow-hidden"
                      >
                        <button
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
                          onClick={() => setExpandedMeal(isExpanded ? null : mealKey)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {meal.name === 'Breakfast' ? '🌅' :
                               meal.name === 'Lunch' ? '🥗' :
                               meal.name === 'Dinner' ? '🍽️' : '🥜'}
                            </div>
                            <div className="text-left">
                              <div className="text-white font-semibold">{meal.name}</div>
                              <div className="text-gray-400 text-xs">{meal.time}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold ${plan.accentColor}`}>
                              {meal.calories} cal
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 border-t border-gray-700 pt-3 space-y-2">
                                {meal.foods.map((food) => (
                                  <div key={food.name} className="flex items-center justify-between bg-gray-900/60 rounded-lg px-3 py-2">
                                    <div>
                                      <div className="text-white text-sm">{food.name}</div>
                                      <div className="text-gray-500 text-xs">{food.amount}</div>
                                    </div>
                                    <div className="text-right text-xs">
                                      <div className="text-white font-medium">{food.calories} cal</div>
                                      <div className="text-gray-400">P: {food.protein}g C: {food.carbs}g F: {food.fats}g</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <h4 className="text-white font-semibold mb-3">Key Benefits</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {plan.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 text-gray-400 text-sm">
                        <CheckCircle className={`w-4 h-4 ${plan.accentColor} flex-shrink-0`} />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
