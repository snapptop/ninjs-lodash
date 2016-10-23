/**
 * Test
 */
'use strict'

const _ = require('.')

// _.jslog(_.$())

// let GIT_REPO = "git+https://github.com/snapptop/ninjs-lodash.git"

// // let obj = _.url.all(GIT_REPO)

// // _.jslog(obj)

// //_.jslog(_.$())

// let A_URL = _.url.join('http://blah.com', 'shiz', 'user', 2342356, 'index.html')


// // _.log(_.url.join(_.url.dir(A_URL), _.url.name(GIT_REPO)))

// _.log(_.url.dir(A_URL))



_.exec({
  cwd: _.path.join(_.$('paths.storage'), 'libs'),
  cmd: 'git',
  args: ['clone', 'https://github.com/ExodusMovement/varstruct-cstring.git']
},
(err, result) => {
  if(err) return console.log(err)
  console.log(result)
})