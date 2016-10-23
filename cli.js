'use strict'

const _ = require('lodash')
const snapptop = require('.')

rns()

exports = module.exports = {
  "rns": rns
}

// runs a name.space
function rns() {
  let jargv = _.$('env.jargv')
  let key = _.get(jargv, '_[0]')
  let prop = key ? _.get(snapptop, key) : null

  if(!_.isFunction(prop)) return _.log(`\nApi.Method ${key || 'NO KEY'} not found\n`)

  _.log(`\nRunnng test: ${key}\n`)
  _.log(jargv)
  _.log()

  jargv = _.omit(jargv, ['_'])

  var ret = _.attempt(prop, jargv, (err, result) => {
    if(err) return _.log(err)
    _.log(result)
  })

  if(_.isError(ret)) _.log(ret)

  return ret
}