import { Request, Response, NextFunction } from 'express';
import Workout from '../models/Workout';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// GET /api/workouts - Get all public workouts with filtering
export const getWorkouts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      difficulty,
      day,
      category,
      muscleGroup,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    // Build filter object based on query parameters
    const filter: Record<string, any> = { isPublic: true };

    if (difficulty) filter.difficulty = difficulty;
    if (day) filter.day = day;
    if (category) filter.category = category;
    if (muscleGroup) filter.muscleGroups = { $in: [muscleGroup] };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { muscleGroups: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [workouts, total] = await Promise.all([
      Workout.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-__v'),
      Workout.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        workouts,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/workouts/:id - Get single workout by ID
export const getWorkoutById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const workout = await Workout.findById(req.params.id).select('-__v');
    if (!workout) {
      throw new AppError('Workout not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { workout },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/workouts/weekly-plan - Get complete weekly workout plan
export const getWeeklyPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { difficulty = 'intermediate' } = req.query;

    // Get one workout per day for the selected difficulty level
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyPlan: Record<string, any> = {};

    for (const day of days) {
      const workout = await Workout.findOne({
        day,
        difficulty,
        isPublic: true,
      }).select('-__v');
      weeklyPlan[day] = workout;
    }

    res.status(200).json({
      success: true,
      data: { weeklyPlan },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/workouts/:id/save - Save workout to user's favorites
export const saveWorkout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const workoutId = req.params.id;
    const userId = req.user!.id;

    // Verify workout exists
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      throw new AppError('Workout not found', 404);
    }

    // Add to saved workouts if not already saved
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const alreadySaved = user.savedWorkouts.some(
      (id) => id.toString() === workoutId
    );

    if (alreadySaved) {
      // Remove from saved workouts (toggle behavior)
      user.savedWorkouts = user.savedWorkouts.filter(
        (id) => id.toString() !== workoutId
      );
      await user.save();
      res.status(200).json({
        success: true,
        message: 'Workout removed from favorites',
        data: { saved: false },
      });
    } else {
      user.savedWorkouts.push(workout._id as any);
      await user.save();
      res.status(200).json({
        success: true,
        message: 'Workout saved to favorites!',
        data: { saved: true },
      });
    }
  } catch (error) {
    next(error);
  }
};

// GET /api/workouts/saved - Get user's saved workouts
export const getSavedWorkouts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id).populate({
      path: 'savedWorkouts',
      select: '-__v',
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { savedWorkouts: user.savedWorkouts },
    });
  } catch (error) {
    next(error);
  }
};
