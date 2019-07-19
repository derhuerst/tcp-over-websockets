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
Options:
    --port    -p  The port to listen on. Default: 8080
\n`)
	process.exit()
}

if (argv.version || argv.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit()
}

const startServer = require('../server')

const port = parseInt(argv.port || argv.p || 8080)

startServer(port, (err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	} else console.info(`listening on ${port}`)
})
