'use strict';

const EventEmitter = require('events');
const crypto = require('crypto');
const buffer = require('buffer');

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

class Websocket extends EventEmitter {
  constructor (server) {
    super();

    this._server = server;
    this._server.on('upgrade', (req, socket, head) => {
      this.upgrade(req, socket, head, (ws) => {
        this.emit(`connection${req.url}`, ws);
        this.emit(`connection`, ws);
      });
    });
  }

  upgrade(req, socket, head, callback) {

    const key = crypto.createHash('sha1')
          .update(req.headers['sec-websocket-key'] + GUID, 'binary')
          .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${key}`
    ];

    this.socket = socket;

    this.emit('headers', headers);
    this.socket.write(headers.concat('', '').join('\r\n'));

    callback(this);
  }

  send(data, callback) {

    if (!data) data = '';
    callback(data);
  }

  close(message) {

    this.emit('close', message);
    this.socket.destroy();
  }
}

module.exports = Websocket;
