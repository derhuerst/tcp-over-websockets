'use strict'

const ws = require('websocket-stream')
const {createServer} = require('net')
const pipe = require('pump')
const debug = require('debug')('tcp-over-websockets:client')

const startClient = (tunnel, target, port, cb) => {
	const tcpServer = createServer((local) => {
		const remote = ws(tunnel + (tunnel.slice(-1) === '/' ? '' : '/') + target)

		const onError = (err) => {
			if (err) debug(err)
		}
		pipe(remote, local, onError)
		pipe(local, remote, onError)
	})

	tcpServer.listen(port, cb)
	return tcpServer
}

module.exports = startClient
