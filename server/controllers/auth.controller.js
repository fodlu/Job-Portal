import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import { sendForgotPassword, sendVerificationEmail } from "../utils/emailService.js";
import jwt from 'jsonwebtoken'

// to register a user
export const register = async (req, res) => {
    try {
        const [name, email, password, role] = req.body;
        const userExist = await userModel.findOne({email});

        if(userExist){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'user'

        // to generate a 6digit otp
        const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationOTPExpires = Date.now() + 10 * 60 * 1000;

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            verificationOTP,
            verificationOTPExpires
        })

        // to send verification email
        try {
            await sendVerificationEmail(email, name, verificationOTP)
        } catch (error) {
            console.error("Failed to send verification email: ", error)
        }

        res.status(201).json({
            success: true,
            message: "Account created successfully! Please check your email for the 6-digit verification code",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: false
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// to login a user
export const login = async (req, res) => {
    try {
            const {email, password} = req.body;
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        if(!user.isVerified){
            return res.status(400).json({
                success: false,
                message: "Please verify your email before logging in."
            })
        }

        const isMatch = await bcrypt.compare(user.password, password);

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or password."
            })
        }

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "7d"})

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

// to verify the email
export const verifyEmail = async (req, res) => {
    try {
        const {email, otp} = req.body;
        if(!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and otp are required"
            })
        }

        const user = await userModel.findOne({
            email,
            verificationOTP: otp,
            verificationOTPExpires: {$gte: Date.now()}
        })

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            })
        }

        user.isVerified = true;
        user.verificationOTP = undefined;
        user.verificationOTPExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now log in."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// if user forgot the ppassword
export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        if(!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User with this email not found."
            })
        }

        const resetOTP = Math.floor(100000 + Math.random() *900000).toString();
        const resetOTPExpires = Date.now() + 10 * 60 * 1000 // 10 mins

        user.resetPasswordOTP = resetOTP;
        user.resetPasswordOTPExpires = resetOTPExpires;
        await user.save()

        try {
            await sendForgotPassword(email, user.name, resetOTP)
        } catch (error) {
            console.error("Failed to send reset email: ", error);
        }

        res.status(200).json({
            success: true,
            message: "Password reset OTP sent to your email"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// to reset the password
export const resetPassword = async (req, res) => {
    try {
        const {email, otp, newPassword} = req.body;
        if(!email || !otp || !newPassword){
            return res.status(400).json({
                success: true,
                message: "Email, OTP and new Password are required."
            })
        }

        const user = await userModel.findOne({
            email,
            resetPasswordOTP : otp,
            resetPasswordOTPExpires: {$gte: Date.now()}
        });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now log in with your new password"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}