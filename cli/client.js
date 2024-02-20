#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('../package.json')

const argv = mri(process.argv.slice(2), {
	boolean: ['help', 'h', 'version', 'v'],
	alias : {H: 'header'}
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    tcp-over-websockets [options] <tunnel-url> <tunnelled-target> <port-to-listen-on>
Arguments:
    tunnel-url         The WebSocket address of the tunnel server.
    tunnelled-target   The hostname & port to let the tunnel server connect to.
    port-to-listen-on  The (local) port to expose the tunnel on.
Options:
	-H, --header <header>    Pass custom header(s) to tunnel server
Example:
    tcp-over-websockets wss://example.org localhost:22 8022
	tcp-over-websockets --header "Cookie:FOOL" wss://example.org localhost:22 8022
\n`)
	process.exit(0)
}
if (argv.version || argv.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit(0)
}

const startClient = require('../client')

const showError = (msg) => {
	console.error(msg)
	process.exit(1)
}

const tunnel = argv._[0]
if (!tunnel) showError('missing tunnel argument')
const target = argv._[1]
if (!target) showError('missing target argument')
const port = argv._[2]
if (!port) showError('missing port argument')

const headers = {}
const headerArgs = Array.isArray(argv.header) ? argv.header : [argv.header]
for (const arg of headerArgs) {
	// we follow curl's mechanism here
	// https://github.com/curl/curl/blob/d5b0fee39a7898dac42cb4fc64e35f5bc085e766/lib/headers.c#L200-L219
	const match = /(?<=\w):\s+(?=.)/.exec(arg);
	if (!match) showError(`invalid --header value: '${arg}'`)
	const name = arg.slice(0, match.index)
	const val = arg.slice(match.index + match[0].length)
	headers[name] = val
}

startClient(tunnel, target, port, {headers}, (err) => {
	if (err) showError(err)
	else console.info(`tunneling ${target} via ${tunnel} & exposing it on port ${port}`)
})
