// http-get-file.js

'use strict';

var http = require('http');
var url  = require('url');
var fs   = require('fs');
var path = require('path');

// environment variables
var HTTP_PROXY_SERVER_URL  = process.env.HTTP_PROXY;
var errFile  = 'error-file.txt';


//######################################################################
function httpGetFile(targetURL, outFile, outDir) { 
  // arguments
  outFile = outFile || 'output-file.txt';

  // no arguments, print usage
  if (!targetURL)
    return console.log('targetURL is null !!!');

  var x = url.parse(targetURL);
  // using proxy server or no proxy
  if (HTTP_PROXY_SERVER_URL) {
    // using proxy server
    console.log('using proxy server: ' + HTTP_PROXY_SERVER_URL);
    var y = url.parse(HTTP_PROXY_SERVER_URL);
    var options = {
      host: y.hostname, 
      port: y.port || 80,
      path: targetURL, 
      headers: {host: x.hostname}
    };
  }
  else {
    // no proxy, direct access
    var options = {
      host: x.hostname, 
      port: x.port || 80,
      path: x.path, 
      headers: {host: x.hostname}
    };
    console.log('host: ' + options.host);
    console.log('port: ' + options.port);
    console.log('path: ' + options.path);
  }

  // http request
  var req = http.get(options, function onSvrRes(res) {
    if (res.statusCode === 200) {
      // ok
      console.log('******************* Successful *****************');
      console.log('Downloaded file: ' + outFile); 
      res.pipe(fs.createWriteStream(path.resolve(outDir, outFile)));
    }
    else {
      // error
      console.log('Error: ' + res.statusCode);
      console.log(res.headers);
      console.log('error file: ' + errFile);
      res.pipe(fs.createWriteStream(errFile));
    }
  });

} // httpGetFile

module.exports.httpGetFile = httpGetFile;
