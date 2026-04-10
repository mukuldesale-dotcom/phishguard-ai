import mongoose, { Document, Schema } from 'mongoose';

// Interface for body measurements
export interface IMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  calves?: number;
}

// Interface for Progress document
export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  weight: number; // kg
  bodyFatPercentage?: number;
  bmi?: number;
  measurements?: IMeasurements;
  workoutCompleted?: mongoose.Types.ObjectId;
  caloriesConsumed?: number;
  caloriesBurned?: number;
  notes?: string;
  mood?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [20, 'Weight must be at least 20kg'],
      max: [500, 'Weight cannot exceed 500kg'],
    },
    bodyFatPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    bmi: {
      type: Number,
      min: 0,
    },
    measurements: {
      chest: { type: Number, min: 0 },
      waist: { type: Number, min: 0 },
      hips: { type: Number, min: 0 },
      arms: { type: Number, min: 0 },
      thighs: { type: Number, min: 0 },
      calves: { type: Number, min: 0 },
    },
    workoutCompleted: {
      type: Schema.Types.ObjectId,
      ref: 'Workout',
    },
    caloriesConsumed: {
      type: Number,
      min: 0,
    },
    caloriesBurned: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    mood: {
      type: String,
      enum: ['excellent', 'good', 'neutral', 'bad', 'terrible'],
    },
    photos: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for efficient user progress queries
progressSchema.index({ userId: 1, date: -1 });

const Progress = mongoose.model<IProgress>('Progress', progressSchema);
export default Progress;
