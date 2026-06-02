import express from 'express';
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';
import { applyJob, getApplicants, getUserApplication } from '../controllers/application.controller.js';

const applicationRouter = express.Router();

applicationRouter.post('/apply/:id', authMiddleware, applyJob)
applicationRouter.get('/user', authMiddleware, getUserApplication)
applicationRouter.get('/:id/applicamts', authMiddleware, authorize("admin"), getApplicants)

export default applicationRouter;