import Joi from "@hapi/joi";

export default {
    createAccount: Joi.object({
        account_name: Joi.string().required(),
        account_type: Joi.string().required(),
        account_balance: Joi.number().integer().optional(),
        account_currency: Joi.string().optional(),
    }),
    updateAccount: Joi.object({
        account_name: Joi.string().optional(),
        account_type: Joi.string().optional(),
        account_balance: Joi.number().integer().optional(),
        account_currency: Joi.string().optional(),
    }),
};
