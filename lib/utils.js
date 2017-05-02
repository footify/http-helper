const _ = require('lodash');
const Joi = require('joi');

function validateModel(data, schema) {
    return Joi.validate(data, schema, {stripUnknown: true});
}

function toSnakeCase(obj) {
    return _.mapKeys(obj, (value, key) => {
        return _.snakeCase(key);
    });
}

function toCamelCase(obj) {
    return _.mapKeys(obj, (value, key) => {
        return _.camelCase(key);
    })
}

function getInput(obj, schema = null) {
    let input = toCamelCase(obj);

    if (schema) {
        input = validateModel(input, schema);
    }
    return input;
}

function formatOutput(obj, schema = null) {
    let output = toCamelCase(obj);

    if (schema) {
        output = validateModel(obj, schema);
    }

    return output;
}

module.exports = {
    validateModel: validateModel,
    toSnakeCase: toSnakeCase,
    toCamelCase: toCamelCase,
    getInput: getInput,
    formatOutput: formatOutput
};