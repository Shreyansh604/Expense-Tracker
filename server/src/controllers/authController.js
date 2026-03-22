import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
    createUser,
    findUserByEmail
} from "../models/userModel.js";

// 🔐 Generate tokens
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m"
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
        }
    );
};


// ================= REGISTER =================
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await createUser({
        name,
        email,
        password: hashedPassword
    });

    // 4. Remove password before sending
    delete user.password;

    res.status(201).json({
        message: "User registered successfully",
        user
    });
});


// ================= LOGIN =================
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Find user
    const user = await findUserByEmail(email);
    if (!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(400, "Invalid email or password");
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 4. (Optional) store refresh token in DB

    delete user.password;

    res.status(200).json({
        message: "Login successful",
        user,
        accessToken,
        refreshToken
    });
});


// ================= LOGOUT =================
export const logoutUser = asyncHandler(async (req, res) => {
    // Optional: remove refresh token from DB

    res.status(200).json({
        message: "Logged out successfully"
    });
});