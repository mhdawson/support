'use strict'
const support = require('../../../index.js')
const Arborist = require('@npmcli/arborist')

// print out the information for a module and its
// children
async function printModule (module, depth, argv) {
  const pkg = module.package
  const moduleInfo = `${pkg.name}(${pkg.version})`

  const supportInfo = await support.getSupportData(pkg,
    module.path,
    argv.canonical,
    argv['base-path'],
    argv.fetch)
  if (supportInfo.resolved) {
    const flattenedSupportInfo = supportInfo.contents.toString().replace(/\n/g, '').replace(/\s+/g, ' ')
    console.log(`${' '.repeat(2 * (depth + 1))}${moduleInfo} - ${flattenedSupportInfo}`)
  } else if (supportInfo.error) {
    console.log(`${' '.repeat(2 * (depth + 1))}${moduleInfo} - failed to fetch - ${supportInfo.url}`)
  } else {
    console.log(`${' '.repeat(2 * (depth + 1))}${moduleInfo} - ${supportInfo.url}`)
  }

  // sort child modules
  module.children = new Map([...module.children.entries()].sort())

  // print info for all of the child modules
  for (const child of module.children.values()) {
    await printModule(child, depth + 1, argv)
  }
};

module.exports = function (opts) {
  return {
    command: 'show',
    desc: 'Show support information',
    builder: function (yargs) {
      return yargs
    },
    handler: function (argv) {
      const arb = new Arborist()
      arb.buildIdealTree({ legacyBundling: true }).then(root => {
        printModule(root, 0, argv).then(() => {}, (e) => {
          argv.log.error('show failed: ', e)
        })
      })
    }
  }
}
