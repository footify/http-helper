const Joi = require('joi');

const outputSchema = Joi.object().keys({
    message: Joi.string().required(),
    code: Joi.number().required(),
    sudCode: Joi.number()
});

module.exports.outputSchema = outputSchema;