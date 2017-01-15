'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

/**
 * Creates a new SimpleRouter instance.
 * @returns {function}
 */
function SimpleRouter () {
  if (!(this instanceof SimpleRouter)) {
    return new SimpleRouter();
  }

  this.staticFileRoot = '';
  this.map = {};
}

/**
 * Writes a key value pair to the
 * map object.
 * @param urlPath {string} Url to serve the file.
 * @param filePath {string} File to be served.
 */
SimpleRouter.prototype.addRoute = function (urlPath, filePath) {

  if (typeof urlPath !== 'string' || typeof filePath !== 'string')
    throw new TypeError('Argument must be a string.');

  if(!fs.existsSync(filePath))
    throw new Error('Cannot serve file ' + filePath);

  this.map[urlPath] = filePath;
}

/**
 * Listens the requests for url
 * and writes to response.
 * @param req {object} IncomingRequest
 * @param res {object} OutgoingResponse
 */
SimpleRouter.prototype.listen = function (req, res) {

  let reqUrl = req.url;
  let reqUrlObj = url.parse(reqUrl);
  let reqUrlPath = reqUrlObj.pathname;

  if (this.map[reqUrlPath] === undefined)
    this._notFound(res);
  else
    this._writeFileToResponse(req, res, this.map[reqUrlPath]);

  if(this.static && fs.existsSync(this.staticFileRoot))
    this._serveStatic(req, res, this.staticFileRoot);
};

/**
 * Add Static Files to path.
 * @param path {string} Path for the static directory/file
 */
SimpleRouter.prototype.static = function (path) {

  if (!path || typeof path !== 'string')
    throw new TypeError('Argument path must be a valid string, instead: ' + typeof path);

  if (this.staticFileRoot)
    throw new Error('Already serving a directory ' + this.staticFileRoot);

  this.staticFileRoot = path;
}

/**
 * Sends a not found page to the client.
 * Checks the file system if the 404 file exists.
 * If not sends a default response.
 * @param res {object} OutgoingResponse
 */
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

/**
 * Serve Static Files.
 * @param req {object} IncomingRequest
 * @param res {object} OutgoingResponse
 * @param path {string} Path for the static directory/file
 */
SimpleRouter.prototype._serveStatic = function (req, res, path) {
  // Do some Magic
}

/**
 * Writes a given file to the response.
 * @param req {object} IncomingRequest
 * @param res {object} OutgoingResponse
 */
SimpleRouter.prototype._writeFileToResponse = function (req, res, filePath) {

  let source = fs.createReadStream(filePath);
  source.pipe(res);
  res.writeHead(200);
}


module.exports = SimpleRouter;
