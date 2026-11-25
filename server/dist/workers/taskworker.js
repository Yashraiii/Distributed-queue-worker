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
exports.worker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.worker = new bullmq_1.Worker('task-queue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[Worker] started job ${job.id} (Type:${job.name})`);
    //do some work
    yield job.updateProgress(10);
    switch (job.name) {
        case "email":
            console.log(`Sending email to ${job.data.to}...`);
            yield new Promise((res) => setTimeout(res, 2000));
            console.log(`Email sent!`);
            break;
        case "report":
            console.log(`Generated report: ${job.data.reportName}...`);
            yield new Promise((res) => setTimeout(res, 300));
            console.log(`Report generated`);
            break;
        case "failure-test":
            console.log(`Running failuere test....Attempt ${job.attemptsMade + 1}`);
            throw new Error("Deliberate failure to test restries & DLQ");
        case "process-payment":
            const { orderId, amount, customerEmail } = job.data;
            if (!orderId) {
                throw new Error("Missing required field: orderId for payment job");
            }
            const idempotencyKey = `idemotency:payment:${orderId}`;
            const aquireLock = yield redis_1.redisClient.set(idempotencyKey, JSON.stringify({ status: "Processed", timeStamp: Date.now() }), "EX", 86400, "NX");
            if (!aquireLock) {
                console.log(`payement already processed for ${orderId}`);
                yield job.log(`skipped duplicate execution for ${orderId}`);
                return {
                    succes: true,
                    status: "DUPLICATE_SKIPPED",
                    orderId,
                    message: "Payment already executed"
                };
            }
            console.log(`charging ${amount} for order ${orderId}(${customerEmail})...`);
            yield new Promise((res) => setTimeout(res, 1500));
            console.log(` Payment of ${amount} captured for Order #${orderId}!`);
            yield job.log(`Payment captured successfully for order #${orderId}`);
            break;
        default:
            console.log(`Unknown job type: ${job.name}`);
    }
    yield job.updateProgress(100);
    return { succes: true, finishedAt: new Date().toISOString() };
}), {
    connection: redis_1.redisConnection,
    concurrency: 2,
    lockDuration: 30000,
    maxStalledCount: 2
});
exports.worker.on("completed", (job) => {
    console.log(` [Job ${job.id}] Finished successfully!`);
});
exports.worker.on("failed", (job, err) => {
    console.error(` [Job ${job === null || job === void 0 ? void 0 : job.id}] Failed (Attempt ${job === null || job === void 0 ? void 0 : job.attemptsMade}): ${err.message}`);
});
