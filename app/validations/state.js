module.exports = Joi => {
    return Joi.object({
        countryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        stateName: Joi.string().min(3).max(30).required(),
        shortCode: Joi.string().min(2).max(10).optional(),
        dialCode: Joi.string().optional(),
        flagIcon :  Joi.string().optional(),
        flagImage :  Joi.string().optional(),
    });
};
