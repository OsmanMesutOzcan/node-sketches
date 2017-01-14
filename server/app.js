const http = require('http');
const PORT = process.env.PORT || 3000;

const SimpleRouter = require('./router.js');
const router = new SimpleRouter();

router.sendFile('/websocket', __dirname + '/websocket/index.html');

http.createServer((req, res) => {
  router.listen(req, res);
}).listen(3000, () => console.log('Running on: ' + PORT));
