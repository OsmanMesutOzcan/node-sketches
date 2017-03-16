'use strict'

const url = require("url");
const http = require("http");

module.exports = {

  logger: function(req, res) {
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
  },


  methods: function() {
    return http.METHODS.forEach((method) => {
      method.toLowerCase();
    });
  },


  merge: function(destination, source, overrideBase = true) {
    if(!destination || !source)
      throw new TypeError("missing destination or source");

    Object.getOwnPropertyNames(source).forEach(function mergeObjects(name){
      // Skip the unwanted properties.
      if(!overrideBase && Object.hasOwnProperty.call(destination, name))
        return;

      let descriptor = Object.getOwnPropertyDescriptor(source, name);
      Object.defineProperty(destination, name, descriptor);
    });

    return destination;
  }
};
