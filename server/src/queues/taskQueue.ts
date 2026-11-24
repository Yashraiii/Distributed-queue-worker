import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const taskQueue = new Queue('task-queue',{
    connection:redisConnection,
    defaultJobOptions:{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:2000,
        },
        removeOnComplete:{
            count:100,
        },
        removeOnFail:{
            count:200,
        }
    }
});
