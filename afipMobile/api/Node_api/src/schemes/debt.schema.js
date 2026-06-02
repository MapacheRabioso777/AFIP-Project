import Joi from "@hapi/joi";

export default {
    createDebt: Joi.object({
        debt_name: Joi.string().required(),
        debt_amount: Joi.number().integer().required(),
        debt_currency: Joi.string().allow('', null).optional(),
        debt_date: Joi.date().optional(),
        debt_status: Joi.string().allow('', null).optional(),
        debt_description: Joi.string().allow('', null).optional(),
    }),
    updateDebt: Joi.object({
        debt_name: Joi.string().optional(),
        debt_amount: Joi.number().integer().optional(),
        debt_currency: Joi.string().allow('', null).optional(),
        debt_date: Joi.date().optional(),
        debt_status: Joi.string().allow('', null).optional(),
        debt_description: Joi.string().allow('', null).optional(),
        debt_paid_amount: Joi.number().allow(null).optional(),
    }),
};
