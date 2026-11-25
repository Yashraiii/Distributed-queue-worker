"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryJob = exports.GetJobs = exports.GetQueueMetrics = exports.CreateJob = void 0;
const taskQueue_1 = require("../queues/taskQueue");
const CreateJob = (type, data, delay) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield taskQueue_1.taskQueue.add(type, data, { delay: delay ? Number(delay) : undefined });
    return job;
});
exports.CreateJob = CreateJob;
const GetQueueMetrics = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield taskQueue_1.taskQueue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed');
    return count;
});
exports.GetQueueMetrics = GetQueueMetrics;
const GetJobs = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (types = ["completed"], start = 0, end = 20, asc = false) {
    const jobs = yield taskQueue_1.taskQueue.getJobs(types, start, end, asc);
    return jobs.map((job) => {
        return {
            id: job.id,
            name: job.name,
            data: job.data,
            progess: job.progress,
            attemptsMade: job.attemptsMade,
            failedReason: job.failedReason,
            timestamp: job.timestamp,
            finishedOn: job.finishedOn,
        };
    });
});
exports.GetJobs = GetJobs;
const RetryJob = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield taskQueue_1.taskQueue.getJob(jobId);
    if (!job) {
        throw new Error(`Job ${jobId} not found`);
    }
    yield job.retry();
    return job;
});
exports.RetryJob = RetryJob;
