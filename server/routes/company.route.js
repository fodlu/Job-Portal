import express from 'express';
import { addCompany, deleteInterviewCompany, getCompanies } from '../controllers/companyController.js';
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
const companyRouter = express.Router();

companyRouter.post('/', authMiddleware, authorize("admin"), upload.single("logo"), addCompany)
companyRouter.get('/', getCompanies)
companyRouter.delete('/:id', authMiddleware, authorize("admin"), deleteInterviewCompany)

export default companyRouter