import { Router } from "express";
import {
    // createUser,
    // getAllUsers,
    // getUserById,
    // updateUser,
    // deleteUser,
    registerUser, 
    loginUser, 
    logoutUser, 
    changeCurrentPassword, 
    refreshAccessToken
} from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// router.route("/users/:id").post(verifyJWT, )

// router.post("/users", validateUser, createUser);
// router.get("/users", getAllUsers);
// router.get("/users/:id", getUserById);
// router.put("/users/:id", validateUser, updateUser);
// router.delete("/users/:id", deleteUser);

export default router;