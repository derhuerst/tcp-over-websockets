#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
const net = require('net')
const ws = require('websocket-stream')

const pkg = require('./package.json')

const showError = (msg) => {
	console.error(msg)
	process.exit(1)
}

const argv = minimist(process.argv.slice(2))

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    tcp-over-websocket --tunnel wss://example.org --remote-port 22 --local-port 8022

Parameters:
    --tunnel       the WebSocket address of the tunnel server
    --remote-port  the port to tunnel
    --local-port   the port to listen on
\n`)
	process.exit()
}

if (argv.version || argv.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit()
}

if (!argv.tunnel) showError('missing --tunnel parameter')
const tunnel = argv.tunnel

if (!argv['remote-port']) showError('missing --remote-port parameter')
const remotePort = argv['remote-port']

if (!argv['local-port']) showError('missing --local-port parameter')
const localPort = argv['local-port']



const tcpServer = net.createServer()
// todo: make this more robust
const target = tunnel + (tunnel.slice(-1) === '/' ? '' : '/') + remotePort

tcpServer.on('connection', (local) => {
	const remote = ws(target)
	local.pipe(remote).pipe(local)
})

tcpServer.listen(localPort, (err) => {
	if (err) showError(err)
	else console.info('listening on ' + localPort)
})
