const http = require('http');
const PORT = process.env.PORT || 3000;

const router = require('./router.js')();
const Websocket = require('./websocket/server.js');

router.addRoute('/', __dirname + '/../index.html');
router.addRoute('/websocket', __dirname + '/websocket/index.html');

const server = http.createServer((req, res) => {
  router.listen(req, res);
}).listen(3000, () => console.log('Running on: ' + PORT));


const ws = new Websocket(server);
ws.on('connection', () => console.log('hi'));
