const config = require('config');

const databaseConfig = config.get('database');

module.exports = JSON.parse(JSON.stringify(databaseConfig));