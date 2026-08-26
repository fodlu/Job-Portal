import mongoose from 'mongoose'

export const connectDb = async(req, res) => {
    await mongoose.connect("mongodb+srv://musediqopeyemi_db_user:1234@cluster0.0nnqdns.mongodb.net/Job", {
  family: 4 // Forces Node.js to use IPv4 instead of IPv6 for DNS lookup
})
    .then(()=> console.log("DB CONNECTED"))
}
// export const connectDb = async(req, res) => {
//     try {
//       await mongoose.connect("mongodb://localhost:27017/jobPortal")
//       console.log("DB connected")
//     } catch (error) {
//       console.error("Error connecting Database");
//     }

// }