module.exports = Joi => {
    return Joi.object({
        empCode: Joi.string().min(3).max(30).required(),
        firstName: Joi.string().min(2).max(10).optional(),
        lastName: Joi.string().min(2).max(10).optional(),
        uanNo: Joi.string().min(2).max(30).optional(),
    });
};
