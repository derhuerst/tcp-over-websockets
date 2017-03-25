#!/usr/bin/env node
'use strict'

const net = require('net')
const http = require('http')
const url = require('url')
const path = require('path')
const ws = require('websocket-stream')

const showError = (msg) => {
	console.error(msg)
	process.exit(1)
}

const validPort = /^[\d]+$/

const verifyRequest = (req, res) => {
	if (req.upgrade) return
	res.statusCode = 405
	res.end('connect via WebSocket protocol')
}

const verifyClient = ({req}, cb) => {
	const port = url.parse(req.url).pathname.slice(1)
	req.tunneledPort = +port
	cb(validPort.test(port), 400, 'invalid port')
}

const httpServer = http.createServer(verifyRequest)
const wsServer = ws.createServer({
	server: httpServer,
	verifyClient
}, (remote) => {
	const req = remote.socket.upgradeReq
	const local = net.createConnection({port: req.tunneledPort})
	local.pipe(remote).pipe(local)
})

httpServer.listen(8080, (err) => {
	if (err) showError(err)
	else console.info('listening on 8080')
})
