# tcp-over-websockets

**Tunnel TCP through WebSockets.** Access anything you want, even from a crappy WiFi which only allows HTTPS.

*Note:* [chisel](https://github.com/jpillora/chisel) is probably the same thing but better. [`@mdslab/wstun`](https://github.com/MDSLab/wstun) is similar.

[![npm version](https://img.shields.io/npm/v/tcp-over-websockets.svg)](https://www.npmjs.com/package/tcp-over-websockets)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/tcp-over-websockets.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## tunneling client

Using [`npx`](https://www.npmjs.com/package/npx):

```shell
npx tcp-over-websockets wss://example.org github.com:22 8022
```

Or by installing manually:

```shell
npm install -g tcp-over-websockets
tcp-over-websockets wss://example.org github.com:22 8022
```

This will expose `github.com:22` on `localhost:8022`, tunneled through a tunneling server at `example.org`.

Works like `ssh -N -L 8022:github.com:22 user@example.org`, except that it's TCP over WebSockets instead of TCP over SSH.


## tunneling server

Using [`npx`](https://www.npmjs.com/package/npx):

```shell
npx -p tcp-over-websockets tcp-over-websockets-server
```

Or by installing manually:

```shell
npm i -g tcp-over-websockets
tcp-over-websockets-server
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/tcp-over-websockets/issues).
