import Joi from "@hapi/joi";

export default {
    createIncome: Joi.object({
        income_name: Joi.string().required(),
        income_amount: Joi.number().required(),
        income_description: Joi.string().allow('', null).optional(),
        income_date: Joi.date().optional(),
        account_FK: Joi.number().integer().allow(null).optional(),
        category_FK: Joi.number().integer().allow(null).optional(),
        assignments: Joi.array().items(Joi.object({
            type: Joi.string().valid('goal', 'debt', 'budget', 'category').required(),
            id: Joi.alternatives().try(Joi.number().integer(), Joi.string()).required(),
            amount: Joi.number().required()
        })).optional(),
    }),
    updateIncome: Joi.object({
        income_name: Joi.string().optional(),
        income_amount: Joi.number().optional(),
        income_description: Joi.string().allow('', null).optional(),
        income_date: Joi.date().optional(),
        account_FK: Joi.number().integer().allow(null).optional(),
        category_FK: Joi.number().integer().allow(null).optional(),
        assignments: Joi.array().items(Joi.object({
            type: Joi.string().valid('goal', 'debt', 'budget', 'category').required(),
            id: Joi.alternatives().try(Joi.number().integer(), Joi.string()).required(),
            amount: Joi.number().required()
        })).optional(),
    }),
};