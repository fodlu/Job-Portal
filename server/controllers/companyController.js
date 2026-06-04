import companyModel from "../models/company.model.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// to get all companies
export const getCompanies = async (req, res) => {
    try {
        const companies = await companyModel.find({});
        res.status(200).json({
            success: true,
            companies
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// to add company
export const addCompany = async (req, res) => {
    try {
        const {website} = req.body;
        if(!website) {
            return res.status(400).json({
                success: false,
                message: "Company's website is required"
            })
        }

        let logoUrl = "";
        if(req.file) {
            const uploadResult = await uploadToCloudinary(
                req.file.buffer,
                "jobportal/logos",
                "image",
                req.file.originalname
            );
            logoUrl = uploadResult.secure_url
        }

        const company = await companyModel.create({
            logo: logoUrl,
            website,
            createdBy: req.user.id,
        });
        res.status(201).json({
            success: true,
            message: "Company added successfully",
            company
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// delete the company
export const deleteInterviewCompany = async (req, res) => {
    try {
        const company = await companyModel.findById(req.params.id)
        if(!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            })
        }

        await company.deleteOne(req.params.id);

        res.status(200).json({
            success: true,
            message: "Company deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

