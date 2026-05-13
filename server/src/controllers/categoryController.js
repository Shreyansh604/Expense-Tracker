import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createCategory, deleteCategory, getCategories } from "../models/categoryModel.js";
import { ApiError } from "../utils/ApiError.js";

const getCategoriesController = asyncHandler(async (req, res) => {
    const categories = await getCategories(req.user.id);
    return res.status(200).json(
        new ApiResponse(200, categories, "Categories fetched successfully")
    );
});

const createCategoryController = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if(!name) throw new ApiError(400, "Category name is required");

    const category = await createCategory(req.user.id, name);

    return res.status(201).json(
        new ApiResponse(201, category, "Category created successfully")
    );
});

const deleteCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await deleteCategory(id, req.user.id);
    if(!category) throw new ApiError(404, "Category not found or unauthorized");

    return res.status(200).json(
        new ApiResponse(200, {}, "Category deleted successfully")
    );
});

export { 
    getCategoriesController,
    createCategoryController,
    deleteCategoryController
};