import Joi from "@hapi/joi";

export default {
    createExpense: Joi.object({
        expense_name: Joi.string().required(),
        expense_amount: Joi.number().required(),
        expense_date: Joi.date().optional(),
        expense_description: Joi.string().allow('', null).optional(),
        user_FK: Joi.string().uuid().optional(),
        category_FK: Joi.number().allow(null).optional(),
        account_FK: Joi.number().allow(null).optional(),
        budget_FK: Joi.number().allow(null).optional(),
    }),
    updateExpense: Joi.object({
        expense_name: Joi.string().optional(),
        expense_amount: Joi.number().optional(),
        expense_date: Joi.date().optional(),
        expense_description: Joi.string().allow('', null).optional(),
        user_FK: Joi.string().uuid().optional(),
        category_FK: Joi.number().allow(null).optional(),
        account_FK: Joi.number().allow(null).optional(),
        budget_FK: Joi.number().allow(null).optional(),
    }),
};