'use strict';

const http = require('http');
const merge = require('../util.js').merge;

const serveStatic = require('./serve-static.js');
const router = require('./router');

function SimpleRouter () {
  let app = {};

  merge(app, router);
  merge(app, serveStatic);

  return app;
}


module.exports = SimpleRouter;
