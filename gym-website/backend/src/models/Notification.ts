import mongoose, { Document, Schema } from 'mongoose';

// Interface for Notification document
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'achievement' | 'reminder' | 'system' | 'social' | 'progress';
  isRead: boolean;
  actionUrl?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    type: {
      type: String,
      enum: ['achievement', 'reminder', 'system', 'social', 'progress'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    actionUrl: String,
    icon: String,
  },
  {
    timestamps: true,
  }
);

// Index for efficient user notification queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;
