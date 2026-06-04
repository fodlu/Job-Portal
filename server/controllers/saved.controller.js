import userModel from "../models/user.model";

// to toggle save job
export const toggleSaveJob = async (req, res) => {
    try {
        const {jobId} = req.params;
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const isSaved = user.savedJobs.includes(jobId);
        if(isSaved) {
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId) // unsaved
        } else {
            user.savedJobs.push(jobId)
        } // saved

        await user.save()
        res.status(200).json({
            success: true,
            message: `Saved Jobs Updated! ${isSaved ? "Job Unsaved" : "Job Saved"}`,
            savedJobs: user.savedJobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// toggle save question
export const toggleSaveQuestion = async (req, res ) => {
    try {
        const {questionId} = req.params;
        const {type} = req.query; // either interview or role question
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }


        let isSaved;
        let message;

        if(type === "role") {
            isSaved = user.savedRoleQuestion.includes(questionId);
            if(isSaved){
                user.savedRoleQuestion = user.savedRoleQuestion.filter(id => id.toString !== questionId);
                message = "Question Unsaved"
            } else {
                user.savedRoleQuestion.push(questionId);
                message = "Question saved"
            }
        } else {
            // default to intervew question
            isSaved = user.savedInterviewQuestions.includes(questionId);
            if(isSaved) {
                user.savedInterviewQuestions = user.savedInterviewQuestions.filter(id => id.toString() !== questionId);
                message = "Question unsaved"
            } else {
                user.savedInterviewQuestions.push(questionId);
                message = "Question saved"
            }

            await user.saved();
            res.status(200).json({
                success: true,
                message,
                savedInterviewQuestions: user.savedInterviewQuestions,
                savedRoleQuestion: user.savedRoleQuestion
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// to get all saved items
export const getSavedItems = async (req, res ) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId)
        .populate("savedJobs")
        .populate({
            path: "savedInterviewQuestions",
            populate: {path: "company"}
        })
        .populate({
            path: "savedRole",
            populate: {path: "roleId"}
        });

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        res.status(200).json({
            success: true,
            savedJobs: user.savedJobs,
            savedInterviewQuestions: user.savedInterviewQuestions,
            savedRoleQuestion: user.savedRoleQuestion
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}