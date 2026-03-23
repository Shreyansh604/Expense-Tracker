import Joi from "joi";

export const transactionSchema = Joi.object({
    amount: Joi.number().positive().required(),
    type: Joi.string()
        .valid("income", "expense")
        .required(),

    category_id: Joi.number().integer().optional(),
    description: Joi.string().allow("").optional(),
    date: Joi.date().required()
});