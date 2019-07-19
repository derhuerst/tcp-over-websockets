#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('../package.json')

const argv = mri(process.argv.slice(2), {
	boolean: ['help', 'h', 'version', 'v']
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    tcp-over-websockets-server
\n`)
	process.exit()
}

if (argv.version || argv.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit()
}

const startServer = require('../server')

const showError = (msg) => {
	console.error(msg)
	process.exit(1)
}

startServer(8080, (err) => {
	if (err) showError(err)
	else console.info('listening on 8080')
})
