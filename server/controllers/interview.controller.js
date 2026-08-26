import { parse } from "dotenv";
import interviewCompanyModel from "../models/interviewCompany.model.js";
import interviewQuestionsModel from "../models/interviewQuestions.model.js";
import interviewRole from "../models/interviewRole.model.js";
import roleQuestionModel from "../models/roleQuestion.model.js";
import {
	handleError,
	parseQuestions,
	replaceQuestions,
	uploadFiles,
} from "../utils/helper.js";
import InterviewRole from "../models/interviewRole.model.js";

// INTERVIEW QUESTION
// to add a company question
export const addInterviewCompany = async (req, res) => {
	try {
		const { companyName, questionsCount, questionsData } = req.body;

		// Basic validation
		if (!companyName?.trim() || !questionsCount) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		const normalizedName = companyName.trim();

		// Case-insensitive existence check
		const exists = await interviewCompanyModel.findOne({
			companyName: { $regex: new RegExp(`^${normalizedName}$`, "i") },
		});

		if (exists) {
			return res.status(400).json({
				success: false,
				message: "Company already exists",
			});
		}

		// Process File Uploads (Expects req.files to match 'logoFile' and 'csvFile')
		const uploads = await uploadFiles(req.files, {
			logoFile: { folder: "jobportal/logos", type: "image" },
			csvFile: { folder: "jobportal/csv", type: "raw" },
		});

		// Create Company Record
		const company = await interviewCompanyModel.create({
			companyName: normalizedName,
			logo: uploads.logoFile || "",
			questionsCount: Number(questionsCount),
			csvfileUrl: uploads.csvFile || "",
			createdBy: req.user.id,
		});

		// Safely handle questionsData parsing & bulk insertion
		if (questionsData) {
			let parsedQuestions = questionsData;

			// Multipart forms transmit objects/arrays as JSON strings
			if (typeof questionsData === "string") {
				try {
					parsedQuestions = JSON.parse(questionsData);
				} catch {
					parsedQuestions = [];
				}
			}

			if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
				const formatted = parseQuestions(
					parsedQuestions,
					"company",
					company._id,
					req.user.id,
				);
				await interviewQuestionsModel.insertMany(formatted);
			}
		}

		return res.status(201).json({
			success: true,
			company,
		});
	} catch (error) {
		handleError(res, error);
	}
};

// to get companies questions
export const getInterviewCompanies = async (req, res) => {
	try {
		const companies = await interviewCompanyModel
			.find()
			.sort({ createdAt: -1 });
		res.status(200).json({
			success: true,
			companies,
		});
	} catch (error) {
		handleError(res, err);
	}
};

// now to get question for that company
export const getInterviewQuestionsByCompany = async (req, res) => {
	try {
		const { companyId } = req.params;
		const { company, questions } = await Promise.all([
			interviewCompanyModel.findById(companyId),
			interviewQuestionsModel
				.findById({ company: companyId })
				.sort({ createdAt: -1 }),
		]);

		res.status(200).json({
			success: true,
			company,
			questions,
		});
	} catch (error) {
		handleError(res, error);
	}
};

// update company
export const updateInterviewCompany = async (req, res) => {
	try {
		const { companyId } = req.params;
		const { companyName, questionsCount, questionsData } = req.body;

		const company = await interviewCompanyModel.findById(companyId);
		if (!company) {
			return res.status(404).json({ message: "Company not found" });
		}

		// updated logo and csv file
		if (companyName) company.companyName = companyName;
		if (questionsCount) company.questionsCount = questionsCount;

		const uploads = await uploadFiles(req.file, {
			logoFile: { folder: "jobportal/logos", type: "image" },
			csvFile: { folder: "jobportal/csv", type: "raw" },
		});

		if (uploads.logoFile) company.logo = uploads.logoFile;
		if (uploads.csvFile) company.csvfileUrl = uploads.csvFile;

		await company.save(); // updated

		if (questionsData) {
			const formatted = parseQuestions(
				questionsData,
				"company",
				company._id,
				req.user.id,
			);

			await replaceQuestions(
				interviewQuestionsModel,
				{ company: companyId },
				formatted,
			); // updated file
		}

		res.status(200).json({ success: true, company });
	} catch (error) {
		handleError(res, err);
	}
};

// to delete a company
export const deleteInterviewQuestion = async (req, res) => {
	try {
		const { companyId } = req.params;
		await interviewCompanyModel.findByIdAndDelete(company);
		await interviewQuestionsModel.deleteMany({ company: companyId });

		res.status(200).json({
			success: true,
			message: "Company deleted successfully",
		});
	} catch (error) {
		handleError(res, err);
	}
};

// ROLE BASED QUESTION
//To add a role
export const addInterviewRole = async (req, res) => {
	try {
		const { roleName, questionsData, questionsCount } = req.body;
		if (!roleName || !questionsCount) {
			return res.status(400).json({ message: "Required fields missing" });
		}

		const exists = await interviewRole.findOne({ roleName });
		if (exists) {
			return res.status(400).json({
				message: "Role already exists",
			});
		}
		const uploads = await uploadFiles(req.files, {
			imageFile: { folder: "jobportal/logos", type: "image" },
			csvFile: { folder: "jobportal/csv", type: "raw" },
		});

		const role = await interviewRole.create({
			roleName,
			image: uploads.imageFile || "",
			questionsCount,
			csvfileUrl: uploads.csvFile,
			createdBy: req.user.id,
		});

		if (questionsData) {
			const formatted = parseQuestions(
				questionsData,
				"role",
				role._id,
				req.user.id,
			);
			await roleQuestionModel.insertMany(formatted);
		}
		res.status(201).json({ success: true, role });
	} catch (err) {
		handleError(res, err);
	}
};

// to get roles
export const getInterviewRole = async (req, res) => {
	try {
		const roles = await interviewRole.find().sort({ createdAt: -1 });
		res.status(200).json({
			success: true,
			roles,
		});
	} catch (err) {
		handleError(res, err);
	}
};

// to fetch questions for roles
export const getQuestionsByRole = async (req, res) => {
	try {
		const { roleId } = req.params;
		const [role, questions] = await Promise.all([
			interviewRole.findById(roleId),
			roleQuestionModel.find({ roleId }).sort({ createdAt: -1 }),
		]);

		res.status(200).json({
			success: true,
			role,
			questions,
		});
	} catch (err) {
		handleError(res, err);
	}
};

// Update Role
export const updateInterviewRole = async (req, res) => {
	try {
		const { roleId } = req.params;
		const { roleName, questionsCount, questionsData } = req.body;

		const role = await InterviewRole.findById(roleId);
		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		if (roleName) role.roleName = roleName;
		if (questionsCount) role.questionsCount = questionsCount;

		const uploads = await uploadFiles(req.files, {
			imageFile: { folder: "jobportal/roles", type: "image" },
			csvFile: { folder: "jobportal/csv", type: "raw" },
		});

		// updated image or csv file
		if (uploads.imageFile) role.image = uploads.imageFile;
		if (uploads.csvFile) role.csvFileUrl = uploads.csvFile;

		await role.save(); // updated

		if (questionsData) {
			const formatted = parseQuestions(
				questionsData,
				"role",
				role._id,
				req.user.id,
			);

			await replaceQuestions(roleQuestionModel, { roleId }, formatted);
		}

		res.status(200).json({ success: true, role });
	} catch (err) {
		handleError(res, err);
	}
};

// to delete a role
export const deleteRole = async (req, res) => {
	try {
		const { roleId } = req.params;
		await interviewRole.findOneAndDelete(roleId);
		await roleQuestionModel.deleteMany({ roleId });

		res.status(200).json({
			success: true,
			message: "Role Deleted Successfully",
		});
	} catch (err) {
		handleError(res, err);
	}
};
