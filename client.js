#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
const net = require('net')
const ws = require('websocket-stream')
const pipe = require('multipipe')

const pkg = require('./package.json')

const noop = () => {}

const showError = (msg) => {
	console.error(msg)
	process.exit(1)
}

const argv = minimist(process.argv.slice(2))

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    tcp-over-websocket --tunnel wss://example.org --target localhost:22 --port 8022

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

if (!argv['target']) showError('missing --target parameter')
const target = argv['target']

if (!argv['port']) showError('missing --port parameter')
const port = argv['port']



const tcpServer = net.createServer()

tcpServer.on('connection', (local) => {
	const remote = ws(tunnel + (tunnel.slice(-1) === '/' ? '' : '/') + target)

	// mute errors here
	pipe(remote, local, noop)
	pipe(local, remote, noop)
})

tcpServer.listen(port, (err) => {
	if (err) showError(err)
	else console.info(`listening on ${port}, exposing ${target} via ${tunnel}`)
})
