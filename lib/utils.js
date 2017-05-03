const Joi = require('joi');
const _ = require('lodash');
const boom = require('boom');
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
    let output = toSnakeCase(obj);

    if (schema) {
        output = validateModel(output, schema);
    }

    return output;
}

function sendReply(res, httpCode, content, schema) {
    if (!content) {
        content = toSnakeCase(httpCode.error);
        httpCode = httpCode.httpCode;
        res.status(httpCode).json(content);
    } else if (schema) {
        content = formatOutput(content, schema);
        if (content.error) {
            let err = errors.schemaValidationError;
            err.error.message +=  content.error;
            sendReply(res, err);
        } else {
            res.status(httpCode).json(content.value);
        }
    } else {
        res.status(httpCode).json(content);
    }

}

function handleError(res, e) {
    if (e && e instanceof Error && e.isBoom) {
        sendReply(res, e.output.statusCode, e.output.payload);
    } else {
        logger.error(e);
        const err = boom.internal(e.message);
        sendReply(res, err.output.statusCode, err.output.payload);
    }
}

function generateRoute(handle) {
    return function (req, res, next) {
        try {
            handle(req, res, next);
        } catch (e) {
            handleError(res, e);
        }
    };
}

module.exports = {
    validateModel: validateModel,
    toSnakeCase: toSnakeCase,
    toCamelCase: toCamelCase,
    getInput: getInput,
    formatOutput: formatOutput,
    sendReply: sendReply,
    handleError: handleError,
    generateRoute: generateRoute
};