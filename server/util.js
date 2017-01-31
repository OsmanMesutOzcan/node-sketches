const url = require("url");

module.exports = {

  logger: function (req, res) {

    let pathname = url.parse(req.url).pathname;
    let method = req.method;

    const styles = {
      0: [33, 39], // Yellow
      1: [32, 39], // Green
      2: [32, 39], // Green
      3: [36, 39], // Cyan
      4: [31, 39], // Red
      5: [33, 39], // Yellow
    };



    res.on('finish', () => {

      let statusCode = res.statusCode;
      let val = statusCode / 100 | 0;
      let style = styles[val]
      let styledStatus = '\u001b[' + style[0] + 'm' + statusCode + '\u001b[' + style[1] + 'm';

      console.log(styledStatus + ' ' + method + ' ' + pathname);
    });
  }
};
