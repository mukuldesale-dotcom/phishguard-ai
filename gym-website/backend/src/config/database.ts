import mongoose from 'mongoose';

// Connect to MongoDB database
const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-website';
  
  try {
    // Configure mongoose options for production use
    await mongoose.connect(mongoUri, {
      // Auto-create indexes in development; disable in production for performance
      autoIndex: process.env.NODE_ENV !== 'production',
    });
    
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDatabase;
