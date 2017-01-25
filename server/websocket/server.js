'use strict';

const EventEmitter = require('events');
const crypto = require('crypto');
const buffer = require('buffer');

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

class Sender {
  constructor (socket) {
    this._socket = socket;
  }

  handleData(data) {
    data = String(data);
    const length = Buffer.byteLength(data);
    console.log(length);
    // Handle the data buffer here
  }

  send(data, callback) {
    // Implement the send logic here.
    this.handleData(data);
    callback(data);
  }
}

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
    this._sender = new Sender (socket);
    callback(this);
  }

  send(data, callback) {
    this._sender.send(data, callback);
  }

  close(message) {
    // TODO close the connection, destroy the socket.
    this.emit('close', message);
    this.socket.destroy();
  }
}


module.exports = WebSocket;
