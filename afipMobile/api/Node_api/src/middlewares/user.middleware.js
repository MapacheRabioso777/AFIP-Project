/**
 * Middleware generico de validacion con Joi
 * Recibe un schema de Joi y valida el body del request
 */
const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: 'Error de validacion',
                errors: error.details.map(detail => detail.message)
            });
        }
        // Update request body with validated and stripped data
        req.body = value;
        next();
    };
};

export default validateSchema;
