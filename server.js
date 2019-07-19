#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

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

const {createConnection} = require('net')
const {createServer: createHttpServer} = require('http')
const url = require('url')
const {createServer: createWsServer} = require('websocket-stream')
const pump = require('pump')
const debug = require('debug')('tcp-over-websockets:server')

const showError = (msg) => {
	console.error(msg)
	process.exit(1)
}

const verifyRequest = (req, res) => {
	if (req.upgrade) return
	res.statusCode = 405
	res.end('connect via WebSocket protocol')
}

const httpServer = createHttpServer(verifyRequest)

const verifyClient = ({req}, cb) => {
	const target = url.parse(req.url).pathname.slice(1)
	const [hostname, port] = target.split(':')
	req.tunnelPort = +port
	req.tunnelHostname = hostname
	cb(!isNaN(port) && hostname, 400, 'invalid target')
}

const wsServer = createWsServer({
	server: httpServer,
	verifyClient
}, (remote, req) => {
	const target = createConnection(req.tunnelPort, req.tunnelHostname)
	target.on('error', console.error)

	const onStreamError = (err) => {
		if (err) debug(err)
	}
	target.once('connect', () => {
		pump(remote, target, onStreamError)
		pump(target, remote, onStreamError)
	})
})

httpServer.listen(8080, (err) => {
	if (err) showError(err)
	else console.info('listening on 8080')
})
