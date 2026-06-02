import jobModel from "../models/job.model.js";
import applicationModel from "../models/application.model.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const createJob = async (req, res) => {
    try {
        let {
            roleName,
            companyName,
            techStack,
            location,
            experience,
            salary,
            salaryType,
            jobType,
            postDate,
            category,
            openings,
            overview,
            responsibilities,
            jobCriteria,
            education,
        } = req.body;

        if (typeof techStack === "string") techStack = JSON.parse(techStack);
        if (typeof responsibilities === "string") responsibilities = JSON.parse(responsibilities);
        if (typeof jobCriteria === "string") jobCriteria = JSON.parse(jobCriteria);
        if (typeof education === "string") education = JSON.parse(education);

        let postDateValue;
        if (postDate) {
            if (typeof postDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(postDate)) {
                const [year, month, day] = postDate.split("-");
                postDateValue = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
            } else {
                postDateValue = new Date(postDate);
            }
            if (isNaN(postDateValue.getTime())) {
                postDateValue = new Date();
            }
        } else {
            postDateValue = new Date();
        }

        let companyLogo = "";
        if (req.file) {
            const uploadRes = await uploadToCloudinary(req.file.buffer, "jobportal/logos", "image", req.file.originalname);
            companyLogo = uploadRes.secure_url;
        }

        const job = new jobModel({
            companyLogo, roleName, companyName, location, experience, salary, salaryType, jobType, techStack, postDate,
            category, openings, responsibilities, jobCriteria, education, overview,
            postDate: postDateValue, createdBy: req.user.id
        })

        await jobModel.save(job)

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        })

    } catch (error) {
        console.error("Error creating the job: ", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server Error"
        })
    }
}

// to get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const {roleName, companyName, location, category, jobType, experience, minSalary, maxSalary, search} = req.query;
        const query = {status: "active"};

        if(search) {
            query.$or = [
                { roleName: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } },
                { techStack: { $regex: search, $options: "i" } }
            ];
        }
        if (roleName) query.roleName = { $regex: roleName, $options: "i" };
        if (companyName) query.companyName = { $regex: companyName, $options: "i" };
        if (location) query.location = { $regex: location, $options: "i" };
        if (experience) query.experience = { $regex: experience, $options: "i" };

        if (category) {
            const categories = Array.isArray(category) ? category : category.split(",");
            query.category = { $in: categories.map(cat => new RegExp(cat, "i")) };
        }

        if (jobType) {
            const types = Array.isArray(jobType) ? jobType : jobType.split(",");
            const normalizeTypeToRegex = (type) => {
                const raw = String(type).trim();
                const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                // Normalize spaces, hyphens, underscores
                const normalized = escaped.replace(/[-_\s]+/g, "[-_\\s]*");
                return new RegExp(`^${normalized}$`, "i");
            };
            query.jobType = { $in: types.map(normalizeTypeToRegex) };
        }

        if (minSalary || maxSalary) {
            query.salary = {};
            if (minSalary) query.salary.$gte = Number(minSalary);
            if (maxSalary) query.salary.$lte = Number(maxSalary);
        }

        const jobs = await jobModel.find(query).sort({createdAt: -1})

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        })

    } catch (error) {
        console.error("Error fetching the job: ", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server Error"
        })
    }
}

// to get the dashboard stats for admin
export const getDashboardStats = async (req, res) => {
    try {
        const adminId = req.user.id;
        const totalJobs = await jobModel.countDocuments();
        const closedJobs = await jobModel.countDocuments({status: "closed"});
        const totalApplicationResult = await applicationModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userRecord"
                }
            },
            {$unwind: "$userRecord"},
            {
                $lookup: {
                    from: "jobs",
                    localField: "job",
                    foreignField: "_id",
                    as: "jobRecord"
                }
            },
            {$unwind: "$jobRecord"},
            {$count: "count"}
        ]);

        const totalApplication = totalApplicationResult[0]?.count || 0;
        const companies = await jobModel.distinct("companyName", {status: "active"});
        const totalCompanies = companies.length;

        return res.status(200).json({
            success: true,
            stats: {
                totalApplication: totalApplication.toLocaleString(),
                totalJobs: totalJobs.toLocaleString(),
                closedJobs: closedJobs.toLocaleString(),
                totalCompanies: totalCompanies.toLocaleString()
            }
        })

    } catch (error) {
        console.error("Error fetching the dashboard stats: ", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server Error"
        })
    }
}

// to get all jobs by the admin
export const getJobsByAdmin = async (req, res) => {
    try {
        const jobs = await jobModel.find().sort({createdAt: -1});
        const applicationStats = await applicationModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    as: "userRecord",
                    foreignField: "_id"
                }
            }, {$unwind: "$userRecord"},
            {
                $group: {
                    _id :"$job",
                    count: {$sum: 1}
                }
            }
        ])

        // map the counts for any easy lookup
        const countsMap = applicationStats.reduce((acc, cur) => {
            acc[cur._id.toString()] = cur.count;
            return acc;
        }, {});
        const jobWithStats = jobs.map((job) => ({
            ...job._doc,
            applicationCount: countsMap[job._id.toString()] || 0
        }))

        return res.status(200).json({
            success: true,
            jobs: jobWithStats
        })

    } catch (error) {
        console.error("Error fetching admin job: ", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server Error"
        })
    }
}

// to get the job by the id
export const getJobById = async (req, res) => {
    try {
        const job = await jobModel.findById(req.params.id)
        if(!job){
            return res.status(404).json({
                success: false,
                message: "Job not found"
            })
        }

        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        console.error("Error fetching the job: ", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server Error"
        })
    }
}

// to update a job
export const updateJob = async (req, res) => {
    try {
        let {
            roleName,
            companyName,
            techStack,
            location,
            experience,
            salary,
            salaryType,
            jobType,
            postDate,
            category,
            openings,
            overview,
            responsibilities,
            jobCriteria,
            education,
        } = req.body;

        // Handle arrays if sent as JSON strings from frontend FormData
        if (typeof techStack === "string") techStack = JSON.parse(techStack);
        if (typeof responsibilities === "string") responsibilities = JSON.parse(responsibilities);
        if (typeof jobCriteria === "string") jobCriteria = JSON.parse(jobCriteria);
        if (typeof education === "string") education = JSON.parse(education);

        let postDateValue;
        if (postDate) {
            if (typeof postDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(postDate)) {
                const [year, month, day] = postDate.split("-");
                // Use UTC to prevent timezone shifts across days
                postDateValue = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
            } else {
                postDateValue = new Date(postDate);
            }
            if (isNaN(postDateValue.getTime())) {
                postDateValue = new Date();
            }
        } else {
            postDateValue = new Date();
        }

        let job = await jobModel.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Admins can update any job

        let companyLogo = job.companyLogo;
        if (req.file) {
            const uploadRes = await uploadToCloudinary(req.file.buffer, "jobportal/logos", "image", req.file.originalname);
            companyLogo = uploadRes.secure_url;
        } // updated images will get saved in cloudinary logos folder

        job = await Job.findByIdAndUpdate(
            req.params.id,
            {
                companyLogo,
                roleName,
                companyName,
                techStack,
                location,
                experience,
                salary,
                salaryType,
                jobType,
                postDate: postDateValue,
                category,
                openings,
                overview,
                responsibilities,
                jobCriteria,
                education,
            },
            { returnDocument: 'after', runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job,
        });
    } catch (error) {
        console.error("Error updating job:", error);
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

// to delete a job
export const deleteJob = async (req, res) => {
    try {
        const job = await jobModel.findById(req.params.id)
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            })
        }

        await applicationModel.deleteMany({job: req.params.id});
        await job.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully and assicated applications removed."
        })

    } catch (error) {
        console.error("Error deleting job:", error);
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
}

// to close a job opening
export const closeJob = async (req, res) => {
    try {
        const job = await jobModel.findById(req.params.id)
        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            })
        }
        job.status = "closed";
        await job.save();
        return res.status(200).json({
            success: true,
            message: "Job closed successfully",
            job
        })
    } catch (error) {
        console.error("Error closing job:", error);
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
}