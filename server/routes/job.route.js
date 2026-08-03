import express from 'express';
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { closeJob, createJob, deleteJob, getAllJobs, getDashboardStats, getJobById, getJobsByAdmin, updateJob } from '../controllers/job.controller.js';


const jobRouter = express.Router()

jobRouter.get('/admin/stats', authMiddleware, authorize("admin"), getDashboardStats)
jobRouter.post('/', authMiddleware, authorize("admin"), upload.single("companyLogo"), createJob);
jobRouter.delete('/:id', authMiddleware, authorize("admin"), deleteJob)
jobRouter.get('/admin/jobs', authMiddleware, authorize("admin"), getJobsByAdmin)

jobRouter.get('/', getAllJobs)
jobRouter.get('/:id', getJobById)

jobRouter.put('/:id', authMiddleware, authorize("admin"), upload.single('company/logo'), updateJob)
jobRouter.patch('/:id/close', authMiddleware, authorize("admin"), closeJob)

export default jobRouter