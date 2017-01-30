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

    this._socket = socket;
    this.emit('headers', headers);
    this._socket.write(headers.concat('', '').join('\r\n'));
    callback(this);
  }

  frameData(data, callback) {
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
    let framingBytes = 2;
    let buffer;

    switch (true) {
      case  (length <= 125):
        framingBytes += 0;
        buffer = Buffer.allocUnsafe(framingBytes + length);
        buffer[1] = length;
        break;

      case (length <= 65535):
        framingBytes += 2;
        buffer = Buffer.allocUnsafe(framingBytes + length);
        buffer[1] = 126;
        buffer.writeUInt16BE(length, 2, true);
        break;

      case  (length >= 65536):
        framingBytes += 8;
        buffer = Buffer.allocUnsafe(framingBytes + length);
        buffer[1] = 127;
        buffer.writeUInt32BE(0, 2, true);
        buffer.writeUInt32BE(length, 6, true);
        break;
    }

    buffer[0] = 129;
    buffer.write(data, framingBytes);
    callback(buffer);
  }

  send(data, callback) {
    let self = this;
    self.frameData(data, (outputBuffer) => {
      self._socket.write(outputBuffer);
      if (callback && typeof callback === 'function')
        callback();
    });
  }

  recieve(callback) {
    let self = this;
    this._socket.on('data', (data) => {
      self.getStats(data, (data, stats) => {
        self.unframe(data, stats, (output) => {
          callback(output);
        });
      });
    });
  }

  getStats(data, callback) {
  // TODO Get the data stats
    let hasMask = data[1] >= 128;
    let secondByte = hasMask ? (data[1] - 128) : null;

    let stats = {};
    stats.framingBytes = 2;
    stats.totalLength = data.length;
    stats.dataLength;
    stats.maskedData;

    switch (true) {
      case  (secondByte == 127):
        stats.framingBytes += 8;
        stats.dataLength = data.readUInt32BE(2) +
                     data.readUInt32BE(6);
        break;

      case (secondByte == 126):
        stats.framingBytes += 2;
        stats.dataLength = data.readUInt16BE(length, 2, true);
        break;

      default:
        stats.framingBytes += 0;
        stats.dataLength = secondByte;
    }

    if (hasMask) {
      stats.maskedData = data.slice(stats.framingBytes, stats.framingBytes + 4);
      stats.framingBytes += 4;
    }
    callback(data, stats);
  }

  unframe(data, stats, callback) {
  // UNFRAME the data according to stats
    let dataArr = [];
    let dataBuf, outputBuf;

    if (stats.maskedData) {
      dataBuf = new Buffer(stats.totalLength, stats.framingBytes);

      for (let i = stats.index, j = 0; i < stats.totalLength; i++, j++) {
        dataBuf[j] = data[i] ^ stats.maskedData[j % 4];
        console.log(dataBuf);
      }
    }

    dataArr.push(dataBuf);

    if(stats.length - (stats.length - stats.framingBytes) === 0) {
      outputBuf = Buffer.concat(dataArr, stats.totalLength);
      outputBuf = outputBuf.toString();
    }
    callback(outputBuf);
  }

  close(message) {
    // TODO close the connection, destroy the socket.
    this.emit('close', message);
    this._socket.destroy();
  }
}

module.exports = WebSocket;
