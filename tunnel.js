'use strict'

const ws = require('websocket-stream')
const pipe = require('pump')
const debug = require('debug')('tcp-over-websockets:client')

const tunnelTo = (tunnel, target, opt) => (local) => {
	const remote = ws(tunnel + (tunnel.slice(-1) === '/' ? '' : '/') + target, opt)

	const onError = (err) => {
		if (err) debug(err)
	}
	pipe(remote, local, onError)
	pipe(local, remote, onError)
}

module.exports = {tunnelTo}
