import { JobType } from "bullmq";
import { taskQueue } from "../queues/taskQueue"


export const CreateJob = async(type: string, data: any, delay?:number)=>{
   const job = await taskQueue.add(type, data, { delay:delay?Number(delay):undefined })
   return job;
   
}

export const GetQueueMetrics = async()=>{
    const count = await taskQueue.getJobCounts('waiting','active','completed','failed','delayed')
    return count;
}

export const GetJobs = async(types:JobType[]=["completed"],start:number=0,end:number=20,asc:boolean=false)=>{
    const jobs = await taskQueue.getJobs(types,start,end,asc);
    return jobs.map((job)=>{
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
    })
}
export const RetryJob = async(jobId:string)=>{
    const job  = await taskQueue.getJob(jobId);
    if(!job){
        throw new Error(`Job ${jobId} not found`);

    }
    await job.retry();
    return job;
}