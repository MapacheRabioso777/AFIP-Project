import Joi from "@hapi/joi";

export default {
    createDebtPayment: Joi.object({
        debtPayment_amount: Joi.number().integer().required(),
        debtPayment_date: Joi.date().optional(),
        debtPayment_description: Joi.string().allow('', null).optional(),
        debt_FK: Joi.number().integer().required(),
    }),
    updateDebtPayment: Joi.object({
        debtPayment_amount: Joi.number().integer().optional(),
        debtPayment_date: Joi.date().optional(),
        debtPayment_description: Joi.string().allow('', null).optional(),
    }),
};
