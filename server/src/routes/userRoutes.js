import { Router } from "express";
import {
    registerUser, 
    loginUser, 
    logoutUser, 
    changeCurrentPassword, 
    refreshAccessToken,
    deleteAccount,
    updateProfile, 
} from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/delete-account").delete(verifyJWT, deleteAccount);
router.route("/update-profile").put(verifyJWT, updateProfile);

export default router;