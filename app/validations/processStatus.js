module.exports = Joi =>{
    return Joi.object({
        processStatus : Joi.string().min(3).max(30).required(),
        shortCode :Joi.string().max(15).required(),
        colorCode : Joi.string().max(15).required(),
        mode : Joi.string().max(30).required(),
        description:Joi.string().optional()
     })
}