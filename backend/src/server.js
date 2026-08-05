import app from './app.js';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const PORT = process.env.PORT || 3000;
export const prisma = new PrismaClient();

async function startServer() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
 

// Trigger nodemon restart - port cleared


// Trigger nodemon restart for SMTP credentials

