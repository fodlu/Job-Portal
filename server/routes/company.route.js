import express from 'express';
import { addCompany, deleteCompany, getCompanies } from '../controllers/companyController.js';
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
const companyRouter = express.Router();

companyRouter.post('/', authMiddleware, authorize("admin"), upload.single("logo"), addCompany)
companyRouter.get('/', getCompanies)
companyRouter.delete('/:id', authMiddleware, authorize("admin"), deleteCompany)

export default companyRouter