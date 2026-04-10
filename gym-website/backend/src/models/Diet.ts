import mongoose, { Document, Schema } from 'mongoose';

// Interface for individual meal
export interface IMeal {
  name: string; // e.g., "Breakfast", "Lunch", "Dinner", "Snack"
  time?: string; // e.g., "7:00 AM"
  foods: {
    name: string;
    amount: string; // e.g., "100g", "1 cup"
    calories: number;
    protein: number; // grams
    carbs: number; // grams
    fats: number; // grams
    imageUrl?: string;
    recipe?: string;
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

// Interface for Diet Plan document
export interface IDiet extends Document {
  name: string;
  description: string;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  dailyCalories: number;
  macros: {
    protein: number; // percentage
    carbs: number; // percentage
    fats: number; // percentage
  };
  meals: IMeal[];
  tags: string[];
  difficulty: 'easy' | 'moderate' | 'strict';
  duration?: number; // weeks
  isPublic: boolean;
  createdBy?: mongoose.Types.ObjectId;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const foodSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  calories: { type: Number, required: true, min: 0 },
  protein: { type: Number, required: true, min: 0 },
  carbs: { type: Number, required: true, min: 0 },
  fats: { type: Number, required: true, min: 0 },
  imageUrl: String,
  recipe: String,
});

const mealSchema = new Schema({
  name: { type: String, required: true },
  time: String,
  foods: [foodSchema],
  totalCalories: { type: Number, required: true },
  totalProtein: { type: Number, required: true },
  totalCarbs: { type: Number, required: true },
  totalFats: { type: Number, required: true },
});

const dietSchema = new Schema<IDiet>(
  {
    name: {
      type: String,
      required: [true, 'Diet plan name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    goal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance'],
      required: true,
    },
    dailyCalories: {
      type: Number,
      required: true,
      min: [500, 'Daily calories must be at least 500'],
      max: [10000, 'Daily calories cannot exceed 10000'],
    },
    macros: {
      protein: { type: Number, required: true, min: 0, max: 100 },
      carbs: { type: Number, required: true, min: 0, max: 100 },
      fats: { type: Number, required: true, min: 0, max: 100 },
    },
    meals: [mealSchema],
    tags: [String],
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'strict'],
      default: 'moderate',
    },
    duration: Number,
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    imageUrl: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for querying by goal
dietSchema.index({ goal: 1, difficulty: 1 });

const Diet = mongoose.model<IDiet>('Diet', dietSchema);
export default Diet;
