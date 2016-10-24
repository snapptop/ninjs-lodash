/**
 * Modules
 */
'use strict'

const _ = require('lodash')

let _MODULES = {
  "package": {
    "excludes": ['node_modules'],
    "defaults": {
      "name": "",
      "description": "",
      "version": "0.0.1",
      "main": "index.js",
      "author": "Stuart MacKenzie",
      "license": "AGPL-1.0",
      "engines": { "node": ">= 0.6" },
      "files": [".ninjs"],
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

module.exports = _MODULES