'use strict';

const util = require('util');
const EventEmitter = require('events');
const crypto = require('crypto');
const buffer = require('buffer');

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

class WebSocket extends EventEmitter {
  constructor (server) {
    super();

    if (server === undefined)
      throw new Error('Argv server cannot be empty');

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
    // TODO send the buffered data.
    if (!data) data = '';
    callback(data);
  }

  close(message) {
    // TODO close the connection, destroy the socket.
    this.emit('close', message);
    this.socket.destroy();
  }
}


module.exports = WebSocket;
