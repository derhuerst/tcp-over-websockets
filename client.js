'use strict'

const {createServer} = require('net')
const {tunnelTo} = require('./tunnel')

const startClient = (tunnel, target, port, cb) => {
	const tcpServer = createServer(tunnelTo(tunnel, target))

	tcpServer.listen(port, cb)
	return tcpServer
}

module.exports = startClient
