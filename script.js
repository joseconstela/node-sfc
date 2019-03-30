const cp = require('child_process')
const debug = require('debug')('nodesfc')

/**
 * Executes a node script, either using nodemon or node executable.
 * 
 * @param {Array} args 
 * @param {Object} program 
 * @param {String} targetPath 
 */
let execute = (args, program, targetPath) => {
  return new Promise((resolve, reject) => {
    if (program.nodemon) {
      args.push('--watch')
      args.push(targetPath)
    }

    let child = cp.spawn(program.nodemon ? 'nodemon' : 'node', args)

    child.stdout.on('data', data =>
      console.log(data.toString().replace(new RegExp(/\n$/), ''))
    )

    child.stderr.on('data', data => {
      console.error(data.toString().replace(new RegExp(/\n$/), ''))
    })

    child.on('close', code =>
      code > 0 ? reject(code) : resolve()
    )
  })
}

module.exports.execute = execute

/**
 * Executes a npm command
 * 
 * @param {Array} args 
 */
let executeNpm = (args) => {
  return new Promise((resolve, reject) => {
    let child = cp.spawn('npm', args, { stdio: null })
    child.on('close', code =>
      code > 0 ? reject(code) : resolve()
    )
  })
}

module.exports.executeNpm = executeNpm