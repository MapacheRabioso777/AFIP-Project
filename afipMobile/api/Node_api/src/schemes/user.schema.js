import Joi from "@hapi/joi";

export default {
    createUser: Joi.object({
        user_user: Joi.string().required().email(),
        user_name: Joi.string().required(),
        user_password: Joi.string().min(4).required(),
    }),
    updateUser: Joi.object({
        user_user: Joi.string(),
        user_password: Joi.string().min(4),
    }),
};