import { Router } from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/userController.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(logoutUser);


// router.post("/users", validateUser, createUser);
// router.get("/users", getAllUsers);
// router.get("/users/:id", getUserById);
// router.put("/users/:id", validateUser, updateUser);
// router.delete("/users/:id", deleteUser);

export default router;