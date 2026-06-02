import Joi from "@hapi/joi";

export default {
    createGoal: Joi.object({
        goal_name: Joi.string().required(),
        goal_amount: Joi.number().required(),
        goal_target_date: Joi.date().optional(),
        goal_description: Joi.string().allow('', null).optional(),
    }),
    updateGoal: Joi.object({
        goal_name: Joi.string().optional(),
        goal_amount: Joi.number().optional(),
        goal_target_date: Joi.date().optional(),
        goal_description: Joi.string().allow('', null).optional(),
    }),
};
