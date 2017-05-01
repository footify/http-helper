
const invalidRequestError = {
    httpCode: 400, error: { code: 1, message: 'Invalid request'}
};

const invalidFacebookToken = {
    httpCode: 400, error: { code: 2, subCode: 2, message:  'Invalid facebook token'}
};

const invalidUserUpdate = {
    httpCode: 400, error: { code: 2,  subCode: 3, message:  'Impossible to update email address with an external api login'}
};

const clientExist = {
    httpCode: 403, error: { code: 1,  subCode: 1,  message: 'Client exists'}
};

const userExist = {
    httpCode: 403, error: { code: 2,  subCode: 1,  message: 'User exists httpCode: email address already in use)'}
};

const pseudoExist = {
    httpCode: 403, error: { code: 2,  subCode: 2,  message: 'User exists httpCode: pseudo already in use)'}
};

const userNotFound = {
    httpCode: 404, error: { code: 2,  subCode: 1,  message: 'Unable to find user'}
};


const internalServerError = {
    httpCode: 500,
    error: {
        code: 1,
        message: 'Internal server error ...\n' +
        'Please transmit this stack trace to Maxime Guedj: \n'}
};

module.exports.invalidRequest = invalidRequestError;
module.exports.invalidFacebookToken = invalidFacebookToken;
module.exports.invalidUserUpdate = invalidUserUpdate;
module.exports.clientExist = clientExist;
module.exports.userExist = userExist;
module.exports.pseudoExist = pseudoExist;
module.exports.userNotFound = userNotFound;
module.exports.internalServerError = internalServerError;
