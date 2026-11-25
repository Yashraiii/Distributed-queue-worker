import { Request,Response } from "express";
import { CreateJob, GetQueueMetrics,GetJobs,RetryJob } from "../services/queueService";
import { JobType } from "bullmq";
import { queueEvents } from "../queues/queueEvents";


let clients: Response[] = [];
const sendTodashboard = (data:object)=>{
  clients.forEach((client)=>{
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  })
}
  queueEvents.on('completed',({jobId,returnvalue})=>{
    //broadcast to all clients;
    sendTodashboard({type:'completed',jobId,returnvalue});
  });
  queueEvents.on('failed',({jobId,failedReason})=>{
    //broadcast to all clients;
    sendTodashboard({type:'failed',jobId,failedReason});
  })
  queueEvents.on('delayed',({delay,jobId})=>{
    //broadcast to all clients;
    sendTodashboard({type:'delayed',jobId,delay});
  })
  queueEvents.on('progress',({jobId,data})=>{
    //broadcast to all clients;
    sendTodashboard({type:'progress',jobId,progress:data});
  })
  queueEvents.on('active',({jobId})=>{
    sendTodashboard({type:'active',jobId});
  })
  queueEvents.on('waiting',({jobId})=>{
    sendTodashboard({type:'waiting',jobId})
  })

export const CreateJobs = async(req:Request,res:Response)=>{
    try{
        const {type,data,delay} = req.body;
        //call the service to createjobs
        if(!type){
            return res.status(400).json({
                error:"job type is required"
            })
        }
        const newJob = await CreateJob(type,data,delay);
        return res.status(200).json({
            message: "Job created",
            jobId: newJob.id,
        })


    }
    catch(error:any){
        console.log("Error creating job",error);
        return res.status(500).json({
            error:error.message || "Internal server Error"
        })
    }
}
export const GetjobMetrics = async(req:Request,res:Response)=>{
    try{
        const count = await GetQueueMetrics();
        return res.status(200).json({
            message:"Fecthed job metrices",
            count
        })
    }
    catch(error:any){
        console.log("Error in fetching",error);
        return res.status(500).json({
            error:error.message || "Internal server Error"
        })
    }
}
export const GetJobsList = async (req: Request, res: Response) => {
  try {
    const status = (req.query.status as JobType) || "completed";
    const start = Number(req.query.start) || 0;
    const end = Number(req.query.end) || 20;
    const asc = req.query.asc === "true";
    const jobs = await GetJobs([status], start, end, asc);
    return res.status(200).json({
      message: "Jobs fetched successfully",
      status,
      count: jobs.length,
      jobs,
    });
  } catch (error: any) {
    console.error("Error fetching jobs list:", error);
    return res.status(500).json({
      error: error.message || "Internal server Error",
    });
  }
};
// 4. Retry a specific failed job by its ID
export const RetryJobController = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Job ID is required in URL path" });
    }
    const retriedJob = await RetryJob(id);
    return res.status(200).json({
      message: `Job ${id} retried successfully`,
      jobId: retriedJob.id,
    });
  } 
  catch (error: any) {
    console.error(`Error retrying job ${req.params.id}:`, error);
    return res.status(500).json({
      error: error.message || "Internal server Error",
    });
  }
};
export const StreamEvents = (req:Request,res:Response)=>{
  res.setHeader('Content-Type','text/event-stream');
  res.setHeader('Cache-control','no-cache');
  res.setHeader('Connection','keep-alive');

  clients.push(res);
  res.write(`data ${JSON.stringify({type:'connected',message:'SSE Stream Open'})}\n\n`);
  req.on('close',()=>{
    clients  = clients.filter((client)=>client!=res);
    console.log(`SSE client disconnected.Total active dashboards:${clients.length}`)
  })
};
