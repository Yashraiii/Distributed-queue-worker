import express from 'express';
import cors from 'cors'
import queueroute from './routes/queueRoutes';
const Port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/queue',queueroute)

app.listen(Port,()=>{
    `Server is listening port ${Port}`
})


