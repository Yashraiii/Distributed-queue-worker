import { QueueEvents } from "bullmq";
import { redisConnection } from "../config/redis";

export const queueEvents = new QueueEvents('task-queue',{
    connection:redisConnection
})