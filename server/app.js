const http = require('http');
const PORT = process.env.PORT || 3000;

const router = require('./router.js')();

router.sendFile('/websocket', __dirname + '/websocket/index.html');

http.createServer((req, res) => {
  router.listen(req, res);
}).listen(3000, () => console.log('Running on: ' + PORT));
