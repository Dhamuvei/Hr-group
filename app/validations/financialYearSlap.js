module.exports = Joi => {
    return Joi.object({
        financialYear: Joi.string().min(3).max(30).required(),
        fromYear: Joi.number().required(),
        toYear: Joi.number().required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(), 
        isCurrentYear: Joi.boolean().required() 
    });
};
