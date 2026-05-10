import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { transactionSchema } from "../validators/inputValidator.js";
import { 
    createTransactioncontroller,
    getAllTransactionsController,
    getTransactionByIdController,
    updateTransactionController,
    deleteTransactionController
 } from "../controllers/transactionController.js";
 import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
// console.log("Transaction routes loaded");
router.route("/").post(verifyJWT, validate(transactionSchema), createTransactioncontroller);
router.route("/").get(verifyJWT, getAllTransactionsController);
router.route("/:id").get(verifyJWT, getTransactionByIdController);
router.route("/:id").put(verifyJWT, updateTransactionController);
router.route("/:id").delete(verifyJWT, deleteTransactionController);

export default router;