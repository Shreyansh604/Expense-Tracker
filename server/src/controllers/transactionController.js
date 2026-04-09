import { transactionSchema } from "../validators/inputValidator";
import { createTransaction, getTransactionById } from "../models/transactionModel";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

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

const getTransactionById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if(!id) {
        throw new ApiError(400, "transaction ID is required");
    }

    const transaction = await getTransactions(id);

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

export {
    createTransactioncontroller,
    getTransactionById
}