'use strict'

const {createServer} = require('net')
const {tunnelTo} = require('./tunnel')

const startClient = (tunnel, target, port, opt, cb) => {
	if (arguments.length === 4 && 'function' === typeof opt) {
		cb = opt
		opt = {}
	}
	const tcpServer = createServer(tunnelTo(tunnel, target, opt))

	tcpServer.listen(port, cb)
	return tcpServer
}

module.exports = startClient
