import { Request, Response, NextFunction } from 'express';
import Diet from '../models/Diet';
import { AppError } from '../middleware/errorHandler';

// Escape special regex metacharacters in user-supplied strings
const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/diet - Get all diet plans with filtering
export const getDietPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { goal, difficulty, search } = req.query;

    const filter: Record<string, any> = { isPublic: true };
    if (goal) filter.goal = goal;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      const safeSearch = escapeRegex(search as string);
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { tags: { $in: [new RegExp(safeSearch, 'i')] } },
      ];
    }

    const diets = await Diet.find(filter).sort({ createdAt: -1 }).select('-__v');

    res.status(200).json({
      success: true,
      data: { diets },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/diet/:id - Get single diet plan
export const getDietById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const diet = await Diet.findById(req.params.id).select('-__v');
    if (!diet) {
      throw new AppError('Diet plan not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { diet },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/diet/goal/:goal - Get diet plans by fitness goal
export const getDietByGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { goal } = req.params;
    const validGoals = ['weight_loss', 'muscle_gain', 'maintenance'];

    if (!validGoals.includes(goal)) {
      throw new AppError('Invalid goal. Use: weight_loss, muscle_gain, or maintenance', 400);
    }

    const diets = await Diet.find({ goal, isPublic: true }).select('-__v');

    res.status(200).json({
      success: true,
      data: { diets },
    });
  } catch (error) {
    next(error);
  }
};
