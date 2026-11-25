import express from 'express';
import http from 'http'

const Port = 8000;

const server = http.createServer((req,res)=>{
    res.setHeader('Content-Type','text/event-stream');
    res.setHeader('Cache-control','no-cache');
    res.setHeader('Connection','keep-alive');
    
    let count = 0;
    res.write(`data: ${JSON.stringify({ count })}\n\n`);
    const interval =setInterval(()=>{
        count+=1;
        console.log(count);
        res.write(`data:${JSON.stringify({count})}\n\n`);
    },10000);
    req.on('close',()=>{
        clearInterval(interval)
        res.end();
        console.log('Client disconnected');
    })
    
    
})
server.listen(Port,()=>{
    console.log(`server is listening on the port${Port}`)
})