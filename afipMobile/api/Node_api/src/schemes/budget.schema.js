import Joi from "@hapi/joi";

export default {
    createBudget: Joi.object({
        budget_name: Joi.string().required(),
        budget_amount: Joi.number().integer().required(),
        budget_currency: Joi.string().optional(),
    }),
    updateBudget: Joi.object({
        budget_name: Joi.string().optional(),
        budget_amount: Joi.number().integer().optional(),
        budget_currency: Joi.string().optional(),
        budget_spent_amount: Joi.number().optional(),
    }),
};
