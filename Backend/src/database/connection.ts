import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutrilens';

export const connectDatabase = async (): Promise<void> => {
  try {
    // Bind connection lifecycle hooks
    mongoose.connection.on('connected', () => {
      console.log('MongoDB successfully connected to database');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle process termination cleanly
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error('Failed to initialize MongoDB connection:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();
};

export default connectDatabase;
