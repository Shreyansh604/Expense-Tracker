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

router.route("/transactions").post(verifyJWT, validate(transactionSchema), createTransactioncontroller);
router.route("/transactions").get(verifyJWT, getAllTransactionsController);
router.route("/transactions/:id").get(verifyJWT, getTransactionByIdController);
router.route("/transactions/:id").put(verifyJWT, updateTransactionController);
router.route("/transactions/:id").delete(verifyJWT, deleteTransactionController);

export default router;