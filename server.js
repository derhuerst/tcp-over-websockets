#!/usr/bin/env node
'use strict'

const mri = require('mri')
const net = require('net')
const http = require('http')
const url = require('url')
const path = require('path')
const ws = require('websocket-stream')
const pipe = require('pump')

const noop = () => {}

const showError = (msg) => {
	console.error(msg)
	process.exit(1)
}

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



const verifyRequest = (req, res) => {
	if (req.upgrade) return
	res.statusCode = 405
	res.end('connect via WebSocket protocol')
}

const httpServer = http.createServer(verifyRequest)

const verifyClient = ({req}, cb) => {
	const target = url.parse(req.url).pathname.slice(1)
	const [hostname, port] = target.split(':')
	req.tunnelPort = +port
	req.tunnelHostname = hostname
	cb(!isNaN(port) && hostname, 400, 'invalid target')
}

const wsServer = ws.createServer({
	server: httpServer,
	verifyClient
}, (remote) => {
	const req = remote.socket.upgradeReq
	const target = net.createConnection(req.tunnelPort, req.tunnelHostname)

	target.on('connect', () => {
		// mute errors here
		pipe(remote, target, noop)
		pipe(target, remote, noop)
	})
})

httpServer.listen(8080, (err) => {
	if (err) showError(err)
	else console.info('listening on 8080')
})
