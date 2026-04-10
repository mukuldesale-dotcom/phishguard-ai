import mongoose, { Document, Schema } from 'mongoose';

// Interface for individual exercise within a workout
export interface IExercise {
  name: string;
  description: string;
  sets: number;
  reps: string; // e.g., "10-12" or "until failure"
  duration?: string; // e.g., "30 seconds" for timed exercises
  restTime?: string; // e.g., "60 seconds"
  muscleGroups: string[];
  equipment?: string;
  imageUrl?: string;
  videoUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
}

// Interface for the full Workout document
export interface IWorkout extends Document {
  name: string;
  description: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  exercises: IExercise[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // Total workout duration in minutes
  caloriesBurned?: number;
  muscleGroups: string[];
  category: 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'yoga' | 'sports';
  imageUrl?: string;
  isPublic: boolean;
  createdBy?: mongoose.Types.ObjectId;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  sets: { type: Number, required: true, min: 1 },
  reps: { type: String, required: true },
  duration: String,
  restTime: String,
  muscleGroups: [{ type: String, required: true }],
  equipment: String,
  imageUrl: String,
  videoUrl: String,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  instructions: [String],
});

const workoutSchema = new Schema<IWorkout>(
  {
    name: {
      type: String,
      required: [true, 'Workout name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: [true, 'Day is required'],
    },
    exercises: [exerciseSchema],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: [5, 'Duration must be at least 5 minutes'],
    },
    caloriesBurned: Number,
    muscleGroups: [{ type: String }],
    category: {
      type: String,
      enum: ['strength', 'cardio', 'flexibility', 'hiit', 'yoga', 'sports'],
      default: 'strength',
    },
    imageUrl: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for filtering by difficulty and day
workoutSchema.index({ difficulty: 1, day: 1 });
workoutSchema.index({ muscleGroups: 1 });

const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
export default Workout;
