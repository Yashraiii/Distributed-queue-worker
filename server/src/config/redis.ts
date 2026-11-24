import {Redis} from 'ioredis';
export const redisConnection = {
  host: "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};
export const redisClient = new Redis(redisConnection);