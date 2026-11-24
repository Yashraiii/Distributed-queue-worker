import { Worker,Job } from "bullmq";
import { redisClient, redisConnection } from "../config/redis";


export const worker = new Worker('task-queue',async(job:Job)=>{
    console.log(`[Worker] started job ${job.id} (Type:${job.name})`)
    //do some work
    await job.updateProgress(10);
    switch(job.name){
        case "email":
            console.log(`Sending email to ${job.data.to}...`)
            await new Promise((res)=>setTimeout(res,2000));
            console.log(`Email sent!`);
            break;
        case "report":
            console.log(`Generated report: ${job.data.reportName}...`);
            await new Promise((res)=>setTimeout(res,300));
            console.log(`Report generated`);
            break;
        case "failure-test":
            console.log(`Running failuere test....Attempt ${job.attemptsMade+1}`);
            throw new Error("Deliberate failure to test restries & DLQ");
        case "process-payment":
            const{orderId,amount,customerEmail} = job.data;
            if(!orderId){
                throw new Error("Missing required field: orderId for payment job");
            }
            const idempotencyKey  = `idemotency:payment:${orderId}`;
            const aquireLock = await redisClient.set(
                idempotencyKey,
                JSON.stringify({status:"Processed",timeStamp:Date.now()}),
                "EX",
                86400,
                "NX"
            );
            if(!aquireLock){
                console.log(`payement already processed for ${orderId}`)
                await job.log(`skipped duplicate execution for ${orderId}`);
                return{
                    succes:true,
                    status:"DUPLICATE_SKIPPED",
                    orderId,
                    message:"Payment already executed"
                }
            }
            console.log(`charging ${amount} for order ${orderId}(${customerEmail})...`);
            await new Promise((res)=>setTimeout(res,1500));
            console.log(` Payment of ${amount} captured for Order #${orderId}!`);
            await job.log(`Payment captured successfully for order #${orderId}`);
            break;
            
        default:
            console.log(`Unknown job type: ${job.name}`);
    }
    await job.updateProgress(100);
    return {succes:true,finishedAt:new Date().toISOString()}
},{
    connection:redisConnection,
    concurrency:2,
    lockDuration:30000,
    maxStalledCount:2
}
);
worker.on("completed", (job) => {
  console.log(` [Job ${job.id}] Finished successfully!`);
});
worker.on("failed", (job, err) => {
  console.error(` [Job ${job?.id}] Failed (Attempt ${job?.attemptsMade}): ${err.message}`);
});