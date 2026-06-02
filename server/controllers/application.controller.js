import applicationModel from "../models/application.model.js";
import jobModel from "../models/job.model.js";
import userModel from "../models/user.model.js";

// user to apply for a job
export const applyJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.user.id;

        if(!jobId){
            return res.status(400).json({
                success: false,
                message: "Job ID not found"
            })
        }

        // check if job exists
        const job = await jobModel.findById(jobId);
        if(!job){
            return res.status(400).json({
                success: false,
                message: "The job is not found."
            })
        }

        // check if user's profile is complete
        const user = await userModel.findById(userId);
        if(!user || !user.phone || !user.resume){
            return res.status(400).json({
                success: false,
                message: "Please complete your profile (add phone number and resume) in your profile page before applying for a job."
            })
        }

        // check if the user already applied
        const existingApplication = await applicationModel.findOne({job: jobId, user: userId});
        if(existingApplication){
            return res.success(false).json({
                success: false,
                message: "You have already applied for this job"
            })
        }

        const newApplication = new applicationModel({
            job: jobId,
            user: userId
        })
        await newApplication.save();
        return res.status(201).json({
            success: true,
            message: "Application submitted successfully"
        })
    } catch (error) {
        console.error("Error applying for job: ", error)
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error"
        })
    }
}

// get all applicants for job on the admin panel
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await jobModel.findById(jobId);
        if(!job){
            return res.status(404).json({
                success: false,
                message: "Job not found"
            })
        }

        const applications = await applicationModel.find({job: jobId}).populate({
            path: "user",
            select: "email name phone role resume"
        }).sort({createdAt: -1})

        return res.status(200).json({
            success: true,
            jobName: job.roleName,
            applicants: applications.filter((app)=> app.user).map(app=>({
                applicationId: app._id,
                ...app.user._id,
                appliedDate: app.createdAt,
                resume: app.user.resume || ""
            }))
        })
    } catch (error) {
        console.error("Error fetching the applications: ", error)
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error"
        })
    }
}

// to get all jobs applies by user
export const getUserApplication = async (req, res ) => {
    try {
        const userId = req.user.id;
        const applications = await applicationModel.find({user: userId}).populate("job").sort({createdAt: -1});

        const validApplications = applications.filter(app => app.job !== null);
        return res.status(200).json({
            success: true,
            applications: validApplications
        });

    } catch (error) {
        console.error("Error fetching user application: ", error)
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error"
        })
    }
}