"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.taskQueue = new bullmq_1.Queue('task-queue', {
    connection: redis_1.redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
        removeOnComplete: {
            count: 100,
        },
        removeOnFail: {
            count: 200,
        }
    }
});
