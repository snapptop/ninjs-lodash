/**
 * Url Utils
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ href http://user:pass@subdomain.host.com:8080/p/a/t/h?query=string#hash.val │
 * ├──────────┬┬───────────┬─────────────────┬───────────────────────────┬───────┤
 * │ protocol ││   auth    │      host       │           path            │ hash  │
 * │          ││           ├──────────┬──────┼──────────┬────────────────┤       │
 * │          ││           │ hostname │ port │ pathname │     search     │       │
 * │          ││           │          │      │          ├─┬──────────────┤       │
 * │          ││           │          │      │          │ │    query     │       │
 * |  http:   // user:pass @ host.com : 8080   /p/a/t/h  ?  query=string   #hash |
 * │          ││           │          │      │          │ │              │       │
 * └──────────┴┴───────────┴──────────┴──────┴──────────┴─┴──────────────┴───────┘
 *
 * (all spaces in the "" line should be ignored -- they're purely for formatting)
 *
 * The layout of this js file from top->down is the same
 * as the graph above from left->right (larger first)
 *
 */
'use strict'

// http://user:pass@subdomain.host.com:8080/p/a/t/h?query=string#hash.val
// protocol: 'http:',
// slashes: true,
// auth: 'user:pass',
// host: 'subdomain.host.com:8080',
// port: '8080',
// hostname: 'subdomain.host.com',
// hash: '#hash.val',
// search: '?query=string',
// query: 'query=string',
// pathname: '/p/a/t/h',
// path: '/p/a/t/h?query=string',
// href: 'http://user:pass@subdomain.host.com:8080/p/a/t/h?query=string#hash.val'

'use strict'

const _ = require('lodash')
const url = require('url')
const _path = require('./path')
const _obj = require('./obj')

const REGX_VALID_URL = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
//const REGX_VALID_URL = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
const  REGX_QUERY_OBJECT = /[?&]([^=#]+)=([^&#]*)/g

const ALL_EXCLUDE_KEYS = ['resolve', 'resolveObject', 'Url', 'all', 'isValid', 'parse']

exports = module.exports = url

_.assign(exports, {
  "isValid": isValid,
  "all": all,
  "clean": clean,
  "join": join,
  "href": href,
  "protocol": protocol,
  "slashes": slashes,
  "dir": dir,
  "hostpath": hostpath,
  "home": home,
  "auth": auth,
  "host": host,
  "hostname": hostname,
  "subdomain": subdomain,
  "port": port,
  "path": path,
  "pathname": pathname,
  "aname": aname,
  "name": name,
  "base" : base,
  "search": search,
  "query": query,
  "hash": hash,
  "jquery": jquery
})

_.assign(_, { url: exports })

function isValid(src) { return src ? REGX_VALID_URL.test(src) : false }

// returns result object with props containing each _.url[key] invoked result
function all(src) {
  let ret = {}
  _.forIn(exports, (v, k) => {
    if(!_.isFunction(v) || _.includes(ALL_EXCLUDE_KEYS, k)) return
    ret[k] = _.attempt(v, src)
  })
  return ret
}

// cleans url to be properly formatted
function clean(src) {
  let pidx = src.indexOf('http')
  if(pidx > 0) src = src.substr(pidx)
  return src ? pidx >= 0 || src.indexOf('//') >= 0 ? src : '/' + src : ''
}

function join() {
  let args = _.args(_.toArray(arguments))
  let rando = _.uniqueId()
  let joins = []

  _.each(args, (arg) => {
    let targ = _.attempt(_.toString, arg)
    if(_.isError(targ)) return
    targ = targ.replace(/\/\//g, rando)
    joins = _.concat(joins, _.compact(targ.split(/\//g)))
  })
  joins = _.compact(joins)
  return clean(_.join(joins, '/').replace(rando, '//'))
}

function href(src) { src = clean(src); return src ? _.get(url.parse(src), 'href') : ''  }
function protocol(src) { src = clean(src); return src ? _.get(url.parse(src), 'protocol') : ''  }
function slashes(src) { src = clean(src); return src ? _.get(url.parse(src), 'slashes') : ''  }

function dir() {
  let src = join(arguments)
   return src ? _.path.dir(src) : ''
}

function hostpath(src) { src = clean(src); return src ? _.join([protocol(src), "//", host(src), pathname(src)], "") : ''  }
function home(src) { src = clean(src); return src ? _.join([protocol(src), "//", host(src)], "") : ''  }
function auth(src) { src = clean(src); return src ? _.get(url.parse(src), 'auth') : ''  }
function host(src) { src = clean(src); return src ? _.get(url.parse(src), 'host') : ''  }
function hostname(src) { src = clean(src); return src ? _.get(url.parse(src), 'hostname') : ''  }
function subdomain(src) { src = clean(src); return /[^.]+/.exec(_.replace(_.replace(src, 'http://'), 'https://'))[0] }
function port(src) { src = clean(src); return src ? _.get(url.parse(src), 'port') : ''  }
function path(src) { src = clean(src); return src ? _.get(url.parse(src), 'path') : ''  }
function pathname(src) { src = clean(src); return src ? _.get(url.parse(src), 'pathname') : ''  }

function aname() {
  let src = join(arguments)
  let srcdir = src ? dir(src) : ''
  let srcname = src ? name(src) : ''
  return join(srcdir, srcname)
}

function name(src) { src = clean(src); return src ? _.path.name(src) : '' }
function base(src) { src = clean(src); return src ? _.path.base(src) : '' }
function search(src) { src = clean(src); return src ? _.get(url.parse(src), 'search') : ''  }
function query(src) { src = clean(src); return src ? _.get(url.parse(src), 'query') : ''  }
function hash(src) { src = clean(src); return src ? _.get(url.parse(src), 'hash') : ''  }

// return json query object
function jquery(src) {
  src = clean(src);
  let params = {}
  let match = null
  if (!url || !_.isString(src)) return params
  while (match = REGX_QUERY_OBJECT.exec(src)) { params[match[1]] = match[2] }
  return params
}