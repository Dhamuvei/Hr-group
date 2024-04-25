module.exports = Joi => {
    return Joi.object({
        cityName: Joi.string().min(3).max(30).required(),
        countryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), 
        stateId : Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), 
        shortCode: Joi.string().min(2).max(10).optional(),
        dialCode: Joi.string().optional(),
        flagIcon :  Joi.string().optional(),
        flagImage :  Joi.string().optional(),
    });
};
