module.exports = Joi => {
    return Joi.object({
        timezoneName: Joi.string().min(3).max(30).required(),
        UST : Joi.string().min(3).max(30).required(),
        diffDuration: Joi.number().precision(2).required(),
        countryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), 
        description :Joi.string().min(3).max(30).optional(),

    });
};