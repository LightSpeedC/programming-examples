(function () {
  'use strict';

  var http = require('http');

  // http create server. server on 'request'
  var server = http.createServer(function request(req, res) {
    res.on('close', function close() {});
    res.on('finish', function finish() {});
    // res.writeHead(statusCode, [statusMessage], [headers])
    // res.writeHead(200, {
    //   'Content-Length': body.length,
    //   'Content-Type': 'text/plain' });
    // res.setTimeout(msecs, cb);
    // res.statusCode    // number 404
    // res.statusMessage // string 'Not found'
    // res.setHeader(name, value)
    res.sendDate = false;
    // res.getHeader(name)
    // res.write(chunk, [encoding = 'utf8'])
    // res.end([data], [encoding = 'utf8'])
    // res.addTrailers(headers)
    // clireq = http.request(options, [callback])
  });

  // server on 'connection' / socket
  server.on('connection', function connection(soc) {
  });

  // server on 'connect' / HTTP CONNECT
  server.on('connect', function connect(req, soc, head) {
  });

  // server on 'upgrade' / HTTP UPGRADE
  server.on('upgrade', function upgrade(req, soc, head) {
  });

  // server on 'clientError'
  server.on('clientError', function clientError(err, soc) {
  });

  // server listen on 'listening'
  server.listen(PORT, function listening() {
  });

  // server socket timeout
  //server.setTimeout(60000 * 3, function timeout() {
  //});
  server.timeout = 60000 * 3

})();
