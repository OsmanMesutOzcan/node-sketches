'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');


function SimpleRouter () {
  if (!(this instanceof SimpleRouter)) {
    return new SimpleRouter();
  }

  this.map = {};
}


SimpleRouter.prototype.listen = function (req, res) {

  let reqUrl = req.url;
  let reqUrlObj = url.parse(reqUrl);
  let reqUrlPath = reqUrlObj.pathname;

  if (this.map[reqUrlPath] === undefined)
    this._notFound(res);
  else
    this._writeFileToResponse(req, res, this.map[reqUrlPath]);
};


SimpleRouter.prototype.sendFile = function (urlPath, filePath) {

  if (typeof urlPath !== 'string' || typeof filePath !== 'string')
    throw new TypeError('Argument must be a string.');

  if(!fs.existsSync(filePath))
    throw new Error('Cannot serve file ' + filePath);

  this.map[urlPath] = filePath;
}


SimpleRouter.prototype._notFound = function (res) {

  let errorPageTemp =
    `<html>
      <head>
        <meta charset="UTF-8">
        <title>404 Not Found</title>
      </head>
      <body>
        <h1>Not Found</h1>
      </body>
    </html>`;

  res.writeHead(404, {
    'content-type': 'text/html'
  });

  res.end(errorPageTemp);
};


SimpleRouter.prototype._writeFileToResponse = function (req, res, filePath) {

  let source = fs.createReadStream(filePath);
  source.pipe(res);
  res.writeHead(200);
}


module.exports = SimpleRouter;
