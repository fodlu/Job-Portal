import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		mongoose.connection.on("connected", () =>
			console.log("Database connected"),
		);
		await mongoose.connect(
			"mongodb+srv://musediqopeyemi_db_user:mAsM49HTGtVwPMkp@cluster0.p1e95zl.mongodb.net/jobPortal",
		);
	} catch (error) {
		console.log(error.message);
	}
};

// export const connectDb = async(req, res) => {
//     try {
//       await mongoose.connect("mongodb://localhost:27017/jobPortal")
//       console.log("DB connected")
//     } catch (error) {
//       console.error("Error connecting Database");
//     }

// }
