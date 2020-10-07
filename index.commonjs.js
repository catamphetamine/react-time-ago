'use strict'

exports = module.exports = require('./commonjs/ReactTimeAgo').default
// "Smart" autoupdate intervals should be moved to `javascript-time-ago`'s grading scale.
// exports.UPDATE_INTERVALS = require('./commonjs/ReactTimeAgo').UPDATE_INTERVALS
exports['default'] = require('./commonjs/ReactTimeAgo').default