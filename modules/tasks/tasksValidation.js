import Joi from "joi";

const myValidation = (schema) => (req, res, next) => {
    const result = schema.validate(req.body, { abortEarly: false });
    if (result.error) {
        return res.status(400).json({ error: result.error.details });
    }
    return next();
};

const addTask = myValidation(Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    assignTo: Joi.string().required(),
    deadline: Joi.date().required(),
}))

const updateTask = myValidation(Joi.object({
    id: Joi.string().hex().length(24).required(),
    title: Joi.string(),
    description: Joi.string(),
    status: Joi.string().valid("test", "doing", "done"),
}))

const deleteTask = myValidation(Joi.object({
    id: Joi.string().hex().length(24).required(),
}))


export {
    addTask,
    updateTask,
    deleteTask,
};
