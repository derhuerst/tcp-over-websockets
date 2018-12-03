#!/usr/bin/env node
'use strict'

const mri = require('mri')
const net = require('net')
const ws = require('websocket-stream')
const pipe = require('pump')
const debug = require('debug')('tcp-over-websockets:client')

const pkg = require('./package.json')

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
    tcp-over-websockets --tunnel wss://example.org --target localhost:22 --port 8022

Parameters:
    --tunnel  the WebSocket address of the tunnel server
    --target  the hostname & port to connect to
    --port    the port to listen on
\n`)
	process.exit()
}

if (argv.version || argv.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit()
}

if (!argv.tunnel) showError('missing --tunnel parameter')
const tunnel = argv.tunnel

if (!argv.target) showError('missing --target parameter')
const target = argv.target

if (!argv.port) showError('missing --port parameter')
const port = argv.port



const tcpServer = net.createServer()

tcpServer.on('connection', (local) => {
	const remote = ws(tunnel + (tunnel.slice(-1) === '/' ? '' : '/') + target)

	const onError = (err) => {
		if (err) debug(err)
	}
	pipe(remote, local, onError)
	pipe(local, remote, onError)
})

tcpServer.listen(port, (err) => {
	if (err) showError(err)
	else console.info(`listening on ${port}, exposing ${target} via ${tunnel}`)
})
