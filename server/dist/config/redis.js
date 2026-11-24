"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.redisConnection = void 0;
const ioredis_1 = require("ioredis");
exports.redisConnection = {
    host: "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
};
exports.redisClient = new ioredis_1.Redis(exports.redisConnection);
