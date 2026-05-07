import { transactionSchema, updateTransactionSchema } from "../validators/inputValidator.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { 
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransactionModel,
} from "../models/transactionModel.js";

const createTransactioncontroller = asyncHandler(async (req, res) => {

    const { error, value } = transactionSchema.validate(req.body);
    if (error) throw new ApiError(400, error.message);

    const transaction = await createTransaction({
        user_id: req.user.id,
        ...value,
    });

    res.status(201).json(
        new ApiResponse(201, transaction, "Transaction created successfully")
    )
});

const getAllTransactionsController = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const transaction = await getAllTransactions(userId);

    return res.status(200).json(
        new ApiResponse(200, transaction, "Transaction fetched successfully")
    )
})

const getTransactionByIdController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if(!id) {
        throw new ApiError(400, "Transaction ID is required");
    }

    const transaction = await getTransactionById(id);

    if(!transaction) {
        throw new ApiError(404, "Transaction not found");
    }

    if(transaction.user_id !== req.user.id) {
        throw new ApiError(403, "Unauthorized access");
    }

    return res.status(200).json(
        new ApiResponse(200, transaction, "Transaction fetched successfully")
    )
});

const updateTransactionController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { error, value } = updateTransactionSchema.validate(req.body);
    if (error) throw new ApiError(400, error.message);

    const transaction = await getTransactionById(id);
    if(!transaction) {
        throw new ApiError(404, "Transaction not found");
    } 

    if(transaction.user_id !== req.user.id) {
        throw new ApiError(403, "Unauthorized access");
    }

    const updated = await updateTransaction(id, {
        amount: value.amount ?? transaction.amount,
        type: value.type ?? transaction.type,
        category_id: value.category_id ?? transaction.category_id,
        description: value.description ?? transaction.description,
        date: value.date ?? transaction.date,
    });

    return res.status(200).json(
        new ApiResponse(200, updated, "Transaction updated successfully")
    );
})

const deleteTransactionController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transaction = await getTransactionById(id);
    if(!transaction) throw new ApiError(404, "Transaction not found");

    if (transaction.user_id !== req.user.id) {
        throw new ApiError(403, "Unauthorized access");
    }


    await deleteTransactionModel(id);
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Transaction deleted successfully")
    )
})

export {
    createTransactioncontroller,
    getAllTransactionsController,
    getTransactionByIdController,
    updateTransactionController,
    deleteTransactionController
}