module.exports = Joi => {
    return Joi.object({
        section: Joi.string().min(3).max(30).required(),
        exemptionValue : Joi.number().precision(2).optional(),
        exemptionPercentage: Joi.number().precision(2).optional(),
        description :Joi.string().min(3).max(30).optional(),

    });
};