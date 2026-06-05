import express from 'express'
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';
import { getProfile, getResume, updateProfile } from '../controllers/user.controller.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const userRouter = express.Router()

userRouter.get('/profile', authMiddleware, getProfile);
userRouter.get('/resume/:id', getResume);
userRouter.put('/profile', authMiddleware, authorize("user"), upload.single("resume"), updateProfile)

export default userRouter