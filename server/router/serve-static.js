const serveStatic = {};

serveStatic.map = {};

serveStatic.static = function (urlPath, filePath) {

  if (typeof urlPath !== 'string' || typeof filePath !== 'string')
    throw new TypeError('Argument must be a string.');

  this.map[urlPath] = filePath;
}

serveStatic._writeFileToResponse = function (req, res, filePath, fs) {
  let source = fs.createReadStream(filePath);
  source.pipe(res);
  res.writeHead(200);
}

module.exports = serveStatic;
