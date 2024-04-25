module.exports = Joi => {
    return Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().disallow(Joi.ref('currentPassword')).required(),
        // newPassword: Joi.string().disallow(Joi.ref('currentPassword')).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        confirmPassword: Joi.ref('newPassword'),
    });
}