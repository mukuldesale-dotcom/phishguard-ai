import { Request, Response, NextFunction } from 'express';
import Progress from '../models/Progress';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// POST /api/progress - Log new progress entry
export const logProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { date, weight, bodyFatPercentage, measurements, caloriesConsumed, caloriesBurned, notes, mood } = req.body;

    const progress = await Progress.create({
      userId,
      date: date || new Date(),
      weight,
      bodyFatPercentage,
      measurements,
      caloriesConsumed,
      caloriesBurned,
      notes,
      mood,
    });

    res.status(201).json({
      success: true,
      message: 'Progress logged successfully!',
      data: { progress },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/progress - Get user's progress history
export const getProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate, limit = 30 } = req.query;

    const filter: Record<string, any> = { userId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const progress = await Progress.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit as string))
      .select('-__v');

    // Calculate progress statistics
    const stats = progress.length > 0 ? {
      currentWeight: progress[0].weight,
      startWeight: progress[progress.length - 1].weight,
      weightChange: Math.round((progress[0].weight - progress[progress.length - 1].weight) * 10) / 10,
      totalEntries: progress.length,
    } : null;

    res.status(200).json({
      success: true,
      data: { progress, stats },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/progress/:id - Delete progress entry
export const deleteProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!progress) {
      throw new AppError('Progress entry not found', 404);
    }

    await progress.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Progress entry deleted',
    });
  } catch (error) {
    next(error);
  }
};
