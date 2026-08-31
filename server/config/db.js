import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		mongoose.connection.on("connected", () =>
			console.log("Database connected"),
		);
		await mongoose.connect(
			process.env.MONGODB_URI
		);
	} catch (error) {
		console.log(error.message);
	}
};

// export const connectDB = async (req, res) => {
// 	try {
// 		await mongoose.connect("mongodb://localhost:27017/jobPortal");
// 		console.log("DB connected");
// 	} catch (error) {
// 		console.error("Error connecting Database");
// 	}
// };
