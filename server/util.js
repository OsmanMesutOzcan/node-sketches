const url = require("url");

module.exports = {

  logger: function (req, res) {

    let pathname = url.parse(req.url).pathname;
    let method = req.method;
    let val = [];

    const styles = {
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      magenta: [35, 39]
    };


    res.on('finish', () => {

      let statusCode = res.statusCode;

      switch(statusCode) {
      case 200:
        val = styles.green;
        break;
      case 404:
        val = styles.red;
        break;
      default:
        val = styles.magenta;
      }

      let styledStatus = '\u001b[' + val[0] + 'm' + statusCode + '\u001b[' + val[1] + 'm';

      console.log(styledStatus + ' ' + method + ' ' + pathname);

    });

  }
};
