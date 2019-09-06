'use strict'
module.exports = function (opts) {
  return {
    command: 'validate',
    desc: 'Validate support information schema',
    builder: function (yargs) {
      return yargs
    },
    handler: function (argv) {
      argv.log.info('validate')
    }
  }
}
