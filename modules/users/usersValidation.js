import Joi from "joi";

const myValidation = (schema) => (req, res, next) => {
    const result = schema.validate(req.body, { abortEarly: false });
    if (result.error) {
        return res.status(400).json({ error: result.error.details });
    }
    return next();
};


const validateSignUp = myValidation(Joi.object({
    name: Joi.string()
        .pattern(/^[a-zA-Z\s]+$/)
        .min(3)
        .max(30)
        .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    age: Joi.number().integer(),
    gender: Joi.string().valid("male", "female"),
    phone: Joi.string().min(7).max(14),
}));


const validateSignIn = myValidation(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
}))


const validateChangePass = myValidation(Joi.object({
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
}));


const validateUpdate = myValidation(Joi.object({
    name: Joi.string()
        .pattern(/^[a-zA-Z\s]+$/)
        .min(3)
        .max(30)
        .required(),
    age: Joi.number().integer(),
    phone: Joi.string().min(7).max(14),
}));


export {
    validateSignUp,
    validateSignIn,
    validateUpdate,
    validateChangePass,
};
