module.exports = Joi =>{
    return Joi.object({
        taxName : Joi.string().min(3).max(30).required(),
        shortCode:Joi.string().optional(),
        description:Joi.string().optional(),
        cgst :  Joi.number().precision(2).required(),
        sgst :  Joi.number().precision(2).required(),
        igst :  Joi.number().precision(2).required()
     })
}