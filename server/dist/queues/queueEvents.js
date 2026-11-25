"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueEvents = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.queueEvents = new bullmq_1.QueueEvents('task-queue', {
    connection: redis_1.redisConnection
});
