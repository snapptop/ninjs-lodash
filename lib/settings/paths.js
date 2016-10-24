/**
 * App Paths
 */
'use strict'

const _ = require('lodash')
const env = require('./env')

const NODE_ENV = _.get(env, 'node.env')

const SOURCE = "F:"
const MIRROR = "E:"
const STORAGE = "S:"
const FEEDS = "R:"
const BACKUP = "Q:"
const DEV_TARGET = "Y:"
const PROD_TARGET = "Z:"
const TARGET = NODE_ENV === "production" ? PROD_TARGET : DEV_TARGET

let _PATHS = {
  "source": SOURCE,
  "mirror": MIRROR,
  "storage": STORAGE,
  "feeds": FEEDS,
  "backup": BACKUP,
  "dev": DEV_TARGET,
  "prod": PROD_TARGET,
  "target": TARGET
}

module.exports = _PATHS