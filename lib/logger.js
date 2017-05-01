const winston = require('winston');

function requestLogger (appName) {
    return function (req, res, next) {
        req._startTime = new Date();
        const end = res.end;
        res.end = function (chunk, encoding) {
            // Get elapsed time
            const elapsedTime = new Date() - req._startTime;

            // Finish reply
            res.end = end;
            res.end(chunk, encoding);

            const status = res.statusCode;

            req.url = req.originalUrl || req.url;

            let client = '???';
            if (req.user && req.user.name) {
                client = req.user.name;
            }
            else if (req.authInfo && req.authInfo.client && req.authInfo.client.name) {
                client = req.authInfo.client.name;
            }
            const startDateStr = req._startTime.getDate() + '/' + (req._startTime.getMonth() + 1) + '/' + req._startTime.getFullYear() +
                ' ' + req._startTime.getHours() + ':' + req._startTime.getMinutes() + ':' + req._startTime.getSeconds();

            winston.info('[' + startDateStr + '][' + appName.toUpperCase() + '] ' +
                status + ' ' + req.method + ' ' + req.url + ' From ' + client + ' in ' + elapsedTime + 'ms');
        };
        next();
    };
}

module.exports = requestLogger;