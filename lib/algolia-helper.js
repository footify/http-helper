const logger = require('winston');
const dataApi = require('@footify/data-api');
const algoliaSearch = require('algoliasearch');

let client;
let globalIndex;
let userIndex;
let pubIndex;
let babyIndex;

function init() {
    logger.info('Initializing algolia search engine ...');
    client = algoliaSearch(process.env['ALGOLIA_CLIENT_ID'], process.env['ALGOLIA_CLIENT_SECRET']);

    globalIndex = client.initIndex('global');
    userIndex = client.initIndex('users');
    pubIndex = client.initIndex('pubs');
    babyIndex = client.initIndex('baby');
}

function initIndex() {
    logger.info('Indexing user ...');

    let users = [];

    return dataApi.userModel.find({}).exec()
        .then((fUser) => {
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

            return addToIndex(globalIndex, users)
                .then(() => {
                    return addToIndex(userIndex, users)
                        .then(() => {
                            logger.info('Done');
                        });
                });
        });
}

function addObjToIndex(indexes, objects) {
    let resolve = [];

    if (!Array.isArray(objects)) {
        objects = [objects];
    }

    for (let index of indexes) {
        resolve.push(addToIndex(getIndexFromName(index), objects));
    }

    return Promise.all(resolve).then(() => {}).catch((e) => { console.log(e); });
}

function getIndexFromName(name) {
    switch (name) {
        case 'global':
            return globalIndex;
        case 'users':
            return userIndex;
        case 'bar':
            return pubIndex;
        case 'pub':
            return babyIndex;
    }
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
    initIndex: initIndex,
    addObjToIndex: addObjToIndex
};