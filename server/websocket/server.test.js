const WebSocket = require('./server.js');
const http = require('http');

let port = 3001;

describe('upgrade', () => {
  it('throws if instanced without `server` argv', () => {
    expect( () => new WebSocket() ).toThrow();
  });

  it('shouts `give me foodz`', () => {
  });
});
