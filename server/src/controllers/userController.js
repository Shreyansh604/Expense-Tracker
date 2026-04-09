import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    createUser,
    findUserByEmail,
    findUserById,
    removeRefreshToken,
    saveRefreshToken,
} from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await findUserById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token in DB
        await saveRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and access token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    //basic check
    if (!name || !email || !password) {
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
        name,
        email,
        password: hashedPassword,
    });

    // 5. remove password before sending
    delete user.password;

    return res
        .status(201)
        .json(new ApiResponse(201, user, "User created successfully"));
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
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await findUserById(req.user?.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // verify old password
    const isValid = await bcrypt.compare(
        oldPassword,
        user.password
    );

    if (!isValid) {
        throw new ApiError(401, "Old password is incorrect");
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update in DB
    await updateUserPassword(user.id, hashedPassword);

    return res.status(200).json(
        new ApiResponse(200, {}, "Password Update Successfully")
    );
});

export { registerUser, loginUser, logoutUser, changeCurrentPassword, generateAccessAndRefreshTokens };
