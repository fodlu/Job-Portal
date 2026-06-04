import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getSavedItems, toggleSaveJob, toggleSaveQuestion } from "../controllers/saved.controller.js";

const savedRouter = express.Router();

savedRouter.use(authMiddleware);

savedRouter.get('/', getSavedItems);
savedRouter.post('/job/:jobId', toggleSaveJob)
savedRouter.post('/question/:questionId', toggleSaveQuestion)

export default savedRouter;