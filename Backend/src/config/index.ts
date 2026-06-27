import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'local_access_secret_token_123456',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'local_refresh_secret_token_654321',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

export default config;
