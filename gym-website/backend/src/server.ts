import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

// Load environment variables
dotenv.config();

import connectDatabase from './config/database';
import authRoutes from './routes/auth';
import workoutRoutes from './routes/workouts';
import dietRoutes from './routes/diet';
import calculatorRoutes from './routes/calculator';
import progressRoutes from './routes/progress';
import userRoutes from './routes/user';
import errorHandler from './middleware/errorHandler';

const app = express();
const httpServer = createServer(app);

// Socket.io for real-time notifications
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Security middleware - adds various HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GymPro API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/user', userRoutes);

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Centralized error handling (must be last middleware)
app.use(errorHandler);

// Socket.io connection handling for real-time notifications
io.on('connection', (socket) => {
  console.log(`📡 Client connected: ${socket.id}`);

  // Join user's personal room for targeted notifications
  socket.on('join_user_room', (userId: string) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their notification room`);
  });

  // Handle achievement notifications
  socket.on('achievement_earned', (data: { userId: string; achievement: string }) => {
    io.to(`user_${data.userId}`).emit('notification', {
      type: 'achievement',
      title: '🏆 Achievement Unlocked!',
      message: data.achievement,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = parseInt(process.env.PORT || '5000');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log('\n🏋️  GymPro Backend Server');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Socket.io enabled for real-time notifications`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { io };
export default app;
