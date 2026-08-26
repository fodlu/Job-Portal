import mongoose from "mongoose";

const interviewRoleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    questionsCount: {
        type: String,
        required: true
    },
    csvfileUrl: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

const InterviewRole = mongoose.model("InterviewRole", interviewRoleSchema)

export default InterviewRole