'use strict';

const EventEmitter = require('events');

class Websocket extends EventEmitter {
  constructor (server) {
    super ();

    this._server = server;
    this._server.on('upgrade', (req, socket, upgradeHeaders) => {
      this.handleUpgrade(req, socket, upgradeHeaders, (ws) => {
        this.emit(`connection${req.url}`, ws);
        this.emit(`connection`, ws);
      });
    });

    const options = {
      maxPayload: 8 * 1024 * 1024,
      server: null
    };

  upgrade(callback) {
    const key = cyrpto.hash('sha1')
          .upgrade(req.headers['sec-websocket-key'] + GUID, 'binary')
          .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${key}`
    ];

    this.emit('headers', headers);

    socket.write(headers.concat('', '').join('\r\n'));
    let ws = new Websocket();

    callback(ws);
  }

  send() {
  }

  close() {
  }
}
