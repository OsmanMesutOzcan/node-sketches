const http = require('http');
const PORT = process.env.PORT || 3000;

const logger = require('./util.js').logger;
const router = require('./router')();
const Websocket = require('./websocket/server.js');

router.static('/', __dirname + '/../index.html');
router.static('/websocket', __dirname + '/websocket/index.html');

const server = http.createServer((req, res) => {
  router.listen(req, res);
  logger(req, res);
}).listen(3000, () => console.log('Running on: ' + PORT));

const ws = new Websocket(server);

ws.on('connection', (ws) => {

  ws.send('Hello Browser!', () => console.log('sent!'));
  ws.recieve((data) => console.log("B: " + data));

  process.stdin.on('data', (data) => ws.send(data.toString()));
});

