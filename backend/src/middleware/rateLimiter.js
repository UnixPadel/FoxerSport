import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../utils/redis.js';

/**
 * Configure the Redis store for the rate limiter.
 * This ensures that rate limits are shared across multiple Node.js instances
 * and persist even if the server restarts.
 */
const getRedisStore = (prefix) => {
  return new RedisStore({
    // @ts-expect-error - Known issue with rate-limit-redis and node-redis typings
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: prefix, // Used to differentiate between limiters in Redis
  });
};

/**
 * Global Limiter (Anti-DDoS and heavy scraping)
 * Max 150 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300, 
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.NODE_ENV === 'production' ? getRedisStore('rl_global:') : undefined,
  message: { status: 'error', message: 'Too many requests, please try again later.' }
});

/**
 * Auth Limiter (Anti Brute-Force)
 * Max 5 failed/success login or register attempts per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, 
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.NODE_ENV === 'production' ? getRedisStore('rl_auth:') : undefined,
  message: { status: 'error', message: 'Too many authentication attempts. Please wait 15 minutes.' }
});

/**
 * Payment Limiter (Anti Carding)
 * Max 3 payment attempts per 10 minutes per IP.
 */
export const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 3, 
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.NODE_ENV === 'production' ? getRedisStore('rl_payment:') : undefined,
  message: { status: 'error', message: 'Too many payment attempts. Please wait 10 minutes.' }
});
