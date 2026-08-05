import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

// Track whether we've already logged the Redis unavailable warning
let redisWarningLogged = false;
let redisConnected = false;

// Create a Redis client.
// By default, it connects to redis://localhost:6379 if no URL is provided.
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      // Stop reconnecting after 3 attempts to avoid spamming the console
      if (retries > 3) {
        if (!redisWarningLogged) {
          redisWarningLogged = true;
          console.warn('⚠️  Redis unavailable — Rate Limiter will use in-memory fallback.');
        }
        return new Error('Redis not available');
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

// Silently handle Redis errors — only log once, not every retry
redisClient.on('error', () => {
  // Intentionally silent — the reconnectStrategy already handles logging
});

redisClient.on('connect', () => {
  redisConnected = true;
  redisWarningLogged = false;
  console.log('✅ Connected to Redis successfully!');
});

// We must connect to Redis before we can use it.
const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    if (!redisWarningLogged) {
      redisWarningLogged = true;
      console.warn('⚠️  Redis unavailable — Rate Limiter will use in-memory fallback.');
    }
  }
};
connectRedis();

export default redisClient;
