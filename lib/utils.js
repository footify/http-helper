const _ = require('lodash');
const Joi = require('joi');
const errors = require('./error.const');
const logger = require('winston');

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

function sendReply(res, httpCode, content, schema) {
    if (!content) {
        httpCode = content.httpCode;
        content = toSnakeCase(content.error);
        res.status(httpCode.httpCode).json(content);
    } else if (schema) {
        content = formatOutput(content, schema);
        if (content.error) {
            let err = errors.schemaValidationError;
            err.error.message +=  content.error;
            sendReply(res, err);
        } else {
            res.status(httpCode).json(content.value);
        }
    }

}

function handleError(res, e) {
    let err;

    if (!e || e instanceof Error) {
        logger.error(e.message);
        err = errors.internalServerError;
        err.error.message += e;
        sendReply(res, err);
    } else if (e.httpCode && e.message) {
        sendReply(res, e);
    } else {
        logger.error(e.message);
        err = errors.internalServerError;
        err.error.message += ' ??? ';
        sendReply(res, err);
    }
}

module.exports = {
    validateModel: validateModel,
    toSnakeCase: toSnakeCase,
    toCamelCase: toCamelCase,
    getInput: getInput,
    formatOutput: formatOutput,
    sendReply: sendReply,
    handleError: handleError
};