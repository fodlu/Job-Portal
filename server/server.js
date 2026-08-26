// import dns from 'node:dns';
// dns.setServers(['1.1.1.1', '8.8.8.8']);

import dns from "dns";

// Tell Node.js to use Google Public DNS servers globally
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from 'express';
import cors from 'cors'
import "dotenv/config"
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import companyRouter from './routes/company.route.js';
import jobRouter from './routes/job.route.js';
import applicationRouter from './routes/application.route.js';
import interviewRouter from './routes/interview.route.js';
import saveRouter from './routes/saved.route.js';
import inquiryRouter from './routes/inquiry.route.js';

const PORT = process.env.PORT || 5000;
const app = express();

// DB
connectDB()

// MIDDLEWARES
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))

app.use('/uploads', express.static("uploads"))

// ROUTES
app.get('/', (req, res)=> res.send("API IS WORKING"));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/company', companyRouter)
app.use('/api/job', jobRouter)
app.use('/api/application', applicationRouter)
app.use('/api/interview', interviewRouter)
app.use('/api/saved', saveRouter);
app.use('/api/inquiry', inquiryRouter)

app.listen(PORT, ()=> {
    console.log(`Server is started on http://localhost:${PORT}`)
})