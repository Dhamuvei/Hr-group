module.exports = Joi => {
    return Joi.object({
        employmentType: Joi.string().min(3).max(30).required(),
        shortCode: Joi.string().min(2).max(10).optional(),
        description: Joi.string().optional()
    });
};
