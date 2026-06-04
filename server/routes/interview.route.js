import express from "express";
import { addInterviewCompany, addInterviewRole, deleteInterviewQuestion, getInterviewCompanies, getInterviewQuestionsByCompany, getInterviewRole, updateInterviewCompany, updateInterviewRole } from "../controllers/interview.controller.js";
import { authMiddleware, authorize } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { deleteInterviewCompany } from "../controllers/companyController.js";

const interviewRouter = express.Router();

interviewRouter.get('/roles', getInterviewRole);
interviewRouter.get('/roles/"id', getInterviewRole);

interviewRouter.post('/role', authMiddleware, authorize("admin"), upload.fields([
    {name: "imageFile", maxCount: 1},
    {name: "cvsFile", maxCount: 1}
]), addInterviewRole);

interviewRouter.put('/role/:roleId', authMiddleware, authorize('admin'), upload.fields([
    {name: "imageFile", maxCount: 1},
    {name: "cvsFile", maxCount: 1}
]), updateInterviewRole);

interviewRouter.delete('/role/:roleId', authMiddleware, authorize('admin'), deleteInterviewQuestion);

// company
interviewRouter.get('/companies', getInterviewCompanies);
interviewRouter.get('/company/:companyId', getInterviewQuestionsByCompany);
interviewRouter.post('/', authMiddleware, authorize('admin'), upload.fields([
    {name: "logoFile", maxCount: 1},
    {name: "cvsFile", maxCount: 1}
]), addInterviewCompany)

interviewRouter.put('/:companyId', authMiddleware, authorize, upload.fields([
    {name: "imageFile", maxCount: 1},
    {name: "cvsFile", maxCount: 1}
]), updateInterviewCompany)

interviewRouter.delete('/:companyId', authMiddleware, authorize('admin'), deleteInterviewCompany)

export default interviewRouter