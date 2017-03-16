const fs = require('fs');
const url = require('url');

const router = {};

router.listen = function (req, res) {

  let reqUrl = req.url;
  let reqUrlObj = url.parse(reqUrl);
  let reqUrlPath = reqUrlObj.pathname;

  if (this.map[reqUrlPath] === undefined)
    this._notFound(res);
  else
    this._writeFileToResponse(req, res, this.map[reqUrlPath], fs);
};

router._notFound = function (res) {

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


module.exports = router;

// TODO:
// - write a better static serve.
// - add simple middleware logic.
