import { Router } from "express";
import { validate } from "../middlewares/validate";
import { transactionSchema } from "../validators/inputValidator";
import { getTransactionById } from "../controllers/transactionController";

const router = Router();

router.route("/transactions").post(validate(transactionSchema), createTransactioncontroller);
router.route("/transactions/:id").get(getTransactionById);