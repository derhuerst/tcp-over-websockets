# tcp-over-websockets

**Tunnel TCP through WebSockets.** Access anything you want, even from a crappy WiFi which only allows HTTPS.

[![npm version](https://img.shields.io/npm/v/tcp-over-websockets.svg)](https://www.npmjs.com/package/tcp-over-websockets)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/tcp-over-websockets.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## tunneling client

```shell
npm install -g tcp-over-websockets
tcp-over-websockets --tunnel wss://example.org --target github.com:22 --port 8022
```

This will expose `github.com:22` on `localhost:8022`, tunneled through `example.org`. `example.org` is the tunneling server.

Works like `ssh -N -L 8022:github.com:22 user@example.org`, except that it's TCP over WebSockets instead of TCP over SSH.


## tunneling server

```shell
npm i tcp-over-websockets
node node_modules/tcp-over-websockets/server.js # todo
```

There's a public server running at `wss://tcp-over-websockets-abvntgfmzf.now.sh`, powered by [now](https://zeit.co/now) ❤.


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/tcp-over-websockets/issues).
