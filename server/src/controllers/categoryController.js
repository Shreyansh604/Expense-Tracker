import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCategories } from "../models/categoryModel.js";

export const getCategoriesController = asyncHandler(async (req, res) => {
    const categories = await getCategories(req.user.id);
    return res.status(200).json(
        new ApiResponse(200, categories, "Categories fetched successfully")
    );
});