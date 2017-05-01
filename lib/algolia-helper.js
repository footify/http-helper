const logger = require('winston');
const dataApi = require('@footify/data-api');
const algoliaSearch = require('algoliasearch');

let client;
let globalIndex;
let userIndex;
let barIndex;
let babyIndex;

function init() {
    logger.info('Initializing algolia search engine ...');
    client = algoliaSearch(process.env['ALGOLIA_CLIENT_ID'], process.env['ALGOLIA_CLIENT_SECRET']);

    globalIndex = client.initIndex('global');
    userIndex = client.initIndex('users');
    barIndex = client.initIndex('bar');
    babyIndex = client.initIndex('baby');
}

async function initIndex() {
    logger.info('Indexing user ...');

    let users = [];

    const fUsers = await dataApi.userModel.find({}).exec();
    for (let fUser of fUsers) {
        users.push({
            id: fUser._id,
            type: 'user',
            pseudo: `@${fUser.pseudo}`,
            name: `@${fUser.pseudo}`,
            first_name: fUser.firstName,
            last_name: fUser.lastName
        });
    }

    await addToIndex(globalIndex, users);
    await addToIndex(userIndex, users);
}

function addToIndex(index, objects) {
    return new Promise((resolve, reject) => {
        index.addObjects(objects, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    init: init,
    initIndex: initIndex
};