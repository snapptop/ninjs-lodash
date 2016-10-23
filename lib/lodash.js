/**
 * ninjs-lodash
 * Common Utils, etc mixed into _
 */
'use strict'

const _ = require('lodash')

const settings = require('./settings')
const files = require('./files')
const str = require('./str')
const path = require('./path')
const url = require('./url')
const async = require('./async')
const obj = require('./obj')
const fs = require('./fs')
const debug = require('./debug')
const cproc = require('./cproc')

_.unset(_, '_')
_.templateSettings.interpolate = /<%=([\s\S]+?)%>/g
exports = module.exports = _