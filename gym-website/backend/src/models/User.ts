import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface defining the User document structure
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  goal?: 'lose_weight' | 'gain_muscle' | 'maintenance';
  savedWorkouts: mongoose.Types.ObjectId[];
  dietPreferences?: {
    type: string;
    allergies: string[];
    calorieGoal?: number;
  };
  refreshToken?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password in queries by default
    },
    avatar: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      min: [13, 'Must be at least 13 years old'],
      max: [120, 'Please enter a valid age'],
    },
    height: {
      type: Number,
      min: [50, 'Height must be at least 50cm'],
      max: [300, 'Height cannot exceed 300cm'],
    },
    weight: {
      type: Number,
      min: [20, 'Weight must be at least 20kg'],
      max: [500, 'Weight cannot exceed 500kg'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'],
      default: 'moderately_active',
    },
    goal: {
      type: String,
      enum: ['lose_weight', 'gain_muscle', 'maintenance'],
      default: 'maintenance',
    },
    savedWorkouts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Workout',
      },
    ],
    dietPreferences: {
      type: {
        type: String,
        enum: ['weight_loss', 'muscle_gain', 'maintenance', 'vegetarian', 'vegan'],
      },
      allergies: [String],
      calorieGoal: Number,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Auto-add createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = 12; // High cost factor for security
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare candidate password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Index for faster email lookups
userSchema.index({ email: 1 });

const User = mongoose.model<IUser>('User', userSchema);
export default User;
