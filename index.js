module.exports = {
    algoliaHelper: require('./lib/algolia-helper'),
    errors: require('./lib/error.const'),
    errorSchema: require('./lib/error.schema'),
    logger: require('./lib/logger'),
    utils: require('./lib/utils'),
    sendReply: require('./lib/utils').sendReply,
    handleError: require('./lib/utils').handleError,
    generateRoute: require('./lib/utils').generateRoute
};