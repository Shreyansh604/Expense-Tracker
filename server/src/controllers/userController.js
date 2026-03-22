import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    createUser,
    findUserByEmail,
    removeRefreshToken,
    saveRefreshToken,
} from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;

    //basic check
    if (!userName || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const user = await createUser({
        userName,
        email,
        password: hashedPassword,
    });

    // 5. remove password before sending
    delete user.password;

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if(!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new ApiError(400, "Invalid email or password");
    }

    // generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // save refresh token
    await saveRefreshToken(user?.id, refreshToken);

    //remove password to not give user the access to it
    delete user.password;

    return res.status(200).json(
        new ApiResponse(200, {
            user,
            accessToken,
            refreshToken
        },
        "Login successful"
    ));
});

const logoutUser = asyncHandler(async (req, res) => {
    // using req.user.id bcz we didn't fetch user like in loginUser
    await removeRefreshToken(req.user.id);

    return res.status(200).json(
        new ApiResponse(200, "Logged out successfully")
    )
})

export { registerUser, loginUser, logoutUser };
