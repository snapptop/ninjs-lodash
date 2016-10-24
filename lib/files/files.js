/**
 * Files -> File Formatting
 */
'use strict'

const _ = require('lodash')

const _FILES = {
  "csv": require('./csv'),
  "doc": require('./doc'),
  "docx": require('./docx'),
  "html": require('./html'),
  "js": require('./js'),
  "json": require('./json'),
  "md": require('./md'),
  "pdf": require('./pdf'),
  "text": require('./text'),
  "txt": require('./txt'),
  "xls": require('./xls'),
  "xlsx": require('./xlsx')
}

exports = module.exports = function (k) {
  return _.get(_FILES, k)
}

_.assign(exports, _FILES)
_.assign(_, { files: exports })