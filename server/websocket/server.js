/**
 * NOTE!
 *
 * This is some very trivial implementation of a
 * server that can handle incoming and outcoming WebSocket
 * messages as per the definitive framing format.
 * 
 * This implementation is written only for education
 * purposes, it is not a full-featured implementation.
 * 
 * Specification (RFC 6455)
 *
 */


'use strict';

const EventEmitter = require('events');
const crypto = require('crypto');
const buffer = require('buffer');

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

/**
 * The frames you're sending need to be formatted according to the
 * WebSocket framing format.
 */

class Sender {
  constructor (socket) {
    this._socket = socket;
  }

  handleData(data, callback) {
/**
 * The first byte will be 1000 0001 (or 129) for a text frame.
 * It is necessary to determine the length of the raw data so as
 * to send the length bytes correctly:
 * 
 * if 0 <= length <= 125, no  additional bytes
 * if 126 <= length <= 65535, two additional bytes and the second byte is 126
 * if length >= 65536,eight additional bytes, and the second byte is 127
 * 
 * After the length byte(s) comes the raw data.
 */
    data = String(data);
    let length = Buffer.byteLength(data);
    let additionalBytes;
    let buffer;

    switch (true) {
      case  (length <= 125):
        additionalBytes = 0;
        buffer = Buffer.allocUnsafe(additionalBytes + length);
        buffer[1] = length;
        break;

      case (length <= 65535):
        additionalBytes = 2;
        buffer = Buffer.allocUnsafe(additionalBytes);
        buffer[1] = 126;
        buffer.writeUInt16BE(length, 2, true);
        break;

      case  (length >= 65536):
        additionalBytes = 8;
        buffer = Buffer.allocUnsafe(additionalBytes);
        buffer[1] = 127;
        buffer.writeUInt32BE(0, 2, true);
        buffer.writeUInt32BE(length, 6, true);
        break;
    }

    buffer[0] = 129;
    buffer.write(data, 2 + additionalBytes); // Need to retain first 2 bytes.
    callback(buffer, data);
  }

  send(data, callback) {
    let self = this;
    self.handleData(data, (outputBuffer, msg) => {
      self._socket.write(outputBuffer);
      self._socket.write(msg);
      callback(msg);
    });
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
