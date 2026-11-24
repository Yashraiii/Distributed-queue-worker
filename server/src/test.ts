import { taskQueue } from "./queues/taskQueue";

const fun =async()=>{
    await taskQueue.add('process-payment',{
        orderId:"order_999",
        amount:1000,
        customerEmail:"raiyas2002@gmail.com"

    })
    await taskQueue.add('process-payment',{
        orderId:"order_999",
        amount:1000,
        customerEmail:"raiyas2002@gmail.com"

    })
    console.log("Both jobs added! Check your worker terminal.");
    process.exit(0);
   
}
fun();