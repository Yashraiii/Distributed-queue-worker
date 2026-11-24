import { Router } from "express";
import { CreateJobs, GetjobMetrics, GetJobsList, RetryJobController, StreamEvents } from "../controllers/queuecontroller";


 
const queueroute = Router();

queueroute.post('/createjobs',CreateJobs);
queueroute.get('/metrics',GetjobMetrics);
queueroute.post('/jobs',GetJobsList);
queueroute.post('/jobs/:id/retry',RetryJobController)
queueroute.get('/events',StreamEvents)
export default queueroute

