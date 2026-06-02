import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import express from 'express';
import cors from 'cors'
import "dotenv/config"
import { connectDb } from './config/db.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import companyRouter from './routes/company.route.js';
import jobRouter from './routes/job.route.js';
import applicationRouter from './routes/application.route.js';

const PORT = process.env.PORT || 5000;
const app = express();

// DB
connectDb()

// 1:40:00 on youtube

// MIDDLEWARES
app.use(express.json())
app.use(cors)

app.use('/uploads', express.static("uploads"))

// ROUTES
app.get('/', (req, res)=> res.send("API IS WORKING"));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/company', companyRouter)
app.use('/api/job', jobRouter)
app.use('/api/application', applicationRouter)

app.listen(PORT, ()=> {
    console.log(`Server is started on http://localhost:${PORT}`)
})