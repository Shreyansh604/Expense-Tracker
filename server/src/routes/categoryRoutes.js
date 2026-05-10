import { Router } from "express";
import { getCategoriesController } from "../controllers/categoryController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getCategoriesController);

export default router;