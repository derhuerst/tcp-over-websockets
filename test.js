'use strict'

const {createServer: createHttpServer, get: httpGet} = require('http')
const {strictEqual} = require('assert')
const startServer = require('./server')
const startClient = require('./client')

const showError = (err) => {
	if (!err) return;
	console.error(err)
	process.exit(1)
}

const httpServer = createHttpServer((_, res) => res.end('yay!'))
httpServer.listen(5000, (err) => {
	if (err) return showError(err)

	const server = startServer(8080, (err) => {
		if (err) return showError(err)

		const client = startClient('ws://localhost:8080', 'localhost:5000', 5001, (err) => {
			if (err) return showError(err)

			httpGet('http://localhost:5001', (res) => {
				res.once('data', (data) => {
					strictEqual(data.toString('utf-8'), 'yay!')
					console.info('works!')

					client.close()
					server.httpServer.close()
					httpServer.close()
				})
			})
		})
	})
})
