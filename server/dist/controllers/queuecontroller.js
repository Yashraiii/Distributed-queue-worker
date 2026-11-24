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
exports.RetryJobController = exports.GetJobsList = exports.GetjobMetrics = exports.CreateJobs = void 0;
const queueService_1 = require("../services/queueService");
const CreateJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, data, delay } = req.body;
        //call the service to createjobs
        if (!type) {
            return res.status(400).json({
                error: "job type is required"
            });
        }
        const newJob = yield (0, queueService_1.CreateJob)(type, data, delay);
        return res.status(200).json({
            message: "Job created",
            jobId: newJob.id,
        });
    }
    catch (error) {
        console.log("Error creating job", error);
        return res.status(500).json({
            error: error.message || "Internal server Error"
        });
    }
});
exports.CreateJobs = CreateJobs;
const GetjobMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield (0, queueService_1.GetQueueMetrics)();
        return res.status(200).json({
            message: "Fecthed job metrices",
            count
        });
    }
    catch (error) {
        console.log("Error in fetching", error);
        return res.status(500).json({
            error: error.message || "Internal server Error"
        });
    }
});
exports.GetjobMetrics = GetjobMetrics;
const GetJobsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req.query.status || "completed";
        const start = Number(req.query.start) || 0;
        const end = Number(req.query.end) || 20;
        const asc = req.query.asc === "true";
        const jobs = yield (0, queueService_1.GetJobs)([status], start, end, asc);
        return res.status(200).json({
            message: "Jobs fetched successfully",
            status,
            count: jobs.length,
            jobs,
        });
    }
    catch (error) {
        console.error("Error fetching jobs list:", error);
        return res.status(500).json({
            error: error.message || "Internal server Error",
        });
    }
});
exports.GetJobsList = GetJobsList;
// 4. Retry a specific failed job by its ID
const RetryJobController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id) {
            return res.status(400).json({ error: "Job ID is required in URL path" });
        }
        const retriedJob = yield (0, queueService_1.RetryJob)(id);
        return res.status(200).json({
            message: `Job ${id} retried successfully`,
            jobId: retriedJob.id,
        });
    }
    catch (error) {
        console.error(`Error retrying job ${req.params.id}:`, error);
        return res.status(500).json({
            error: error.message || "Internal server Error",
        });
    }
});
exports.RetryJobController = RetryJobController;
