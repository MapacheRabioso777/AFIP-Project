import Joi from "@hapi/joi";

export default {
createCategory: Joi.object({
    category_name: Joi.string().required(),
    category_description: Joi.string().allow('', null).optional(),
    category_type: Joi.string().allow('', null).optional(),
    user_FK: Joi.string().uuid().optional(),
}),
updateCategory: Joi.object({
    category_name: Joi.string().required(),
    category_description: Joi.string().allow('', null).optional(),
    category_type: Joi.string().allow('', null).optional(),
    user_FK: Joi.string().uuid().optional(),
}),
};