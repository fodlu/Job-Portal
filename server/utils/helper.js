import { uploadToCloudinary } from "./cloudinaryUpload.js";

// upload files
export const uploadFiles = async (files, config) => {
    const result = {};

    if (!files || typeof files !== 'object') return result;

    // Run file uploads in parallel for better performance
    const uploadPromises = Object.keys(config).map(async (key) => {
        const fileList = files[key];
        const fileConfig = config[key];

        if (fileList && fileList.length > 0) {
            const file = fileList[0];

            const uploadRes = await uploadToCloudinary(
                file.buffer,
                fileConfig.folder,
                fileConfig.type,
                file.originalname
            );

            return { key, url: uploadRes?.secure_url };
        }
        return null;
    });

    const uploads = await Promise.all(uploadPromises);

    // Populate result object
    for (const upload of uploads) {
        if (upload && upload.url) {
            result[upload.key] = upload.url;
        }
    }

    return result;
};

// parse and format questions
export const parseQuestions = (questionData, type, id, userId) => {
    const parsed = JSON.parse(questionData);

    return parsed.map((q)=> {
        let date = new Date(q.postDate);
        if(isNaN(date)) date = new Date();

        return {
            ...(type === "company" && {company: id}),
            ...(type === "role" && {roleId: id}),
            question: q.question,
            answer: q.answer,
            keypoint: Array.isArray(q.keyPoints) ? q.keyPoints : [q.keyPoints],
            postDate: date,
            createdBy: userId,
            askedBy: q.companies?.map((c) => ({
                companyName: c.name || "",
                dateAsked: c.date || ""
            })) || []
        };
    })
}

// to replace all question
export const replaceQuestions = async (Model, filter, questions) => {
    await Model.deleteMany(filter);
    await Model.insertMany(questions);

}

// handle error
export const handleError = (res, err) => {
    return res.status(500).json({
        success: false,
        message: err.message
    })
}