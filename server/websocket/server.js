'use strict';

const EventEmitter = require('events');
const crypto = require('crypto');

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

class Websocket extends EventEmitter {
  constructor (server) {
    super ();

    this._server = server;
    this._server.on('upgrade', (req, socket, upgradeHeaders) => {
      this.upgrade(req, socket, upgradeHeaders, (ws) => {
        this.emit(`connection${req.url}`, ws);
        this.emit(`connection`, ws);
      });
    });

    const options = {
      maxPayload: 8 * 1024 * 1024,
      server: null
    };
  }
  upgrade(req, socket, upgradeHeaders, callback) {
    const key = crypto.createHash('sha1')
          .update(req.headers['sec-websocket-key'] + GUID, 'binary')
          .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${key}`
    ];

    this.emit('headers', headers);

    socket.write(headers.concat('', '').join('\r\n'));

    callback(this);
  }

  send (data, callback) {
    if (!data) data = '';

    console.log(data);
  }

  close () {
  }
}

module.exports = Websocket;
