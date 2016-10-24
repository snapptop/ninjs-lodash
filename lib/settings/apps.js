/**
 * Apps
 */
'use strict'

const _ = require('lodash')

let _APPS = {
  "package": {
    "excludes": ['node_modules'],
    "defaults": {
      "name": "",
      "description": "",
      "version": "0.0.1",
      "main": "index.js",
      "author": "Stuart MacKenzie",
      "license": "AGPL-1.0",
      "files": [".ninjs"],
      "engines": { "node": ">= 0.6" },
      "scripts": {
        "cli": "set NODE_ENV=development && set DEBUG=* && node ./cli.js",
        "test": "set NODE_ENV=development && set DEBUG=* && node ./test.js"
      },
      "contributors": [ "Stuart John MacKenzie <stuart.mackenzie@snapptop.com>" ],
      "keywords": [],
      "dependencies": {},
      "devDependencies": {}
    }
  }
}

module.exports = _APPS