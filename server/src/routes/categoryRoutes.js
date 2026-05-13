import { Router } from "express";
import { 
    getCategoriesController,
    createCategoryController,
    deleteCategoryController
} from "../controllers/categoryController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getCategoriesController);
router.route("/").post(verifyJWT, createCategoryController);
router.route("/:id").delete(verifyJWT, deleteCategoryController);

export default router;