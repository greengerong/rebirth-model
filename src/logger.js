'use strict';

const bunyan = require('bunyan'),
    pkg = require('../package.json');

var logger = bunyan.createLogger({name: pkg.name});

module.exports = logger;