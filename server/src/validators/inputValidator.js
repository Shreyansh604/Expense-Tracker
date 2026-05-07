import Joi from "joi";

export const transactionSchema = Joi.object({
    amount: Joi.number().positive().required(),
    type: Joi.string()
        .valid("income", "expense")
        .required(),

    category_id: Joi.number().integer().optional(),
    description: Joi.string().allow("").optional(),
    // removed date
});

export const updateTransactionSchema = Joi.object({
    amount: Joi.number().positive().optional(),
    type: Joi.string().valid("income", "expense").optional(),
    category_id: Joi.number().integer().allow(null).optional(),
    description: Joi.string().allow("").optional(),
});