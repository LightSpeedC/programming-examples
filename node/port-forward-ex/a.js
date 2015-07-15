(function () {
  'use strict';

  var http = require('http');
  var net = require('net');
  var url = require('url');

  var logFile = 'log/a-%s.log';
  var logLevel = 'debug';
  var log = require('log-manager').setWriter(new require('log-writer')(logFile)).getLogger();
  log.setLevel(logLevel);

  var numConnections = 0;
  var socketIdSeq = 1000;

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // start port forward
  function startPortForward(servicePort, configOptions) {
    log.info('port %s @@@@ start opt', servicePort, configOptions);

    if (configOptions.proxyUrl)
      var x = url.parse(configOptions.proxyUrl);
    else
      throw new Error('configOptions.proxyUrl must be specified');

    //======================================================================
    // net create server. server on 'connetion'
    var server = net.createServer(function connetion(soc1) {
      log.info('port %s soc1 connected', servicePort);

      var socketId = ++socketIdSeq;
      if (!soc1.$socketId) soc1.$socketId = socketId;
      else log.warn('port %s soc1 reused!', servicePort, soc1.$socketId, socketId);

      var n = 2;
      soc1.on('error', function portsoc1err(err) { // client disconnect!?
        log.warn('port %s soc1 err', servicePort, err);
      });
      soc1.on('end', function portsoc1end() {
        log.info('port %s soc1 end', servicePort, --n);
      });

      var soc2 = net.connect(x.port, x.hostname, function connect() {
        log.info('port %s soc2 connected', servicePort);
      });

      if (!soc2.$socketId) soc2.$socketId = socketIdSeq;
      else log.fatal('port %s soc2 reused!', servicePort, soc2.$socketId, socketIdSeq);

      soc2.on('error', function portsoc2err(err) { // can not connect target!?
        log.warn('port %s soc2 err', servicePort, err);
      });
      soc2.on('end', function portsoc2end() {
        log.info('port %s soc2 end', servicePort, --n);
      });
      soc2.pipe(soc1);
      soc1.pipe(soc2);
    });

    //======================================================================
    // server listen. server on 'listening'
    server.listen(servicePort, function listening() {
      log.info('port %s srvr listening', servicePort, server.address()); });

    //======================================================================
    // server on 'error'
    server.on('error', function portsvrerr(err) {
      log.warn('port %s srvr err', servicePort, err); });

    //======================================================================
    // server.on('close', function close() {});
    // server.close()
  }

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // start http forward
  function startHttpForward(servicePort, configOptions) {

    //======================================================================
    // http create server. server on 'request'
    var server = http.createServer(function request(req1, res1) {
      var soc1 = req1.connection;

      var socketId = ++socketIdSeq;
      if (!soc1.$socketId) soc1.$socketId = socketId;
      else log.warn('http %s soc1 reused!', servicePort, soc1.$socketId, socketId);

      soc1.removeAllListeners('error');
      soc1.on('error', function httpsoc1err(err) {
        log.warn('http %s soc1 err', servicePort, err);
      });

      var x = url.parse(req1.url);
      log.info('http %s req1 conn', servicePort, req1.method, req1.url);

      var n = 2;
      res1.on('close', function close() {});
      res1.on('finish', function finish() {}); // --count
      // res1.writeHead(statusCode, [statusMessage], [headers])
      // res1.writeHead(200, {
      //   'Content-Length': body.length,
      //   'Content-Type': 'text/plain' });
      // res1.setTimeout(msecs, cb);
      // res1.statusCode    // number 404
      // res1.statusMessage // string 'Not found'
      // res1.setHeader(name, value)
      res1.sendDate = false;
      // res1.getHeader(name)
      // res1.write(chunk, [encoding = 'utf8'])
      // res1.end([data], [encoding = 'utf8'])
      // res1.addTrailers(headers)

      var headers = {};
      for (var i in req1.headers) headers[i] = req1.headers[i];
      delete headers['proxy-connection'];
      headers['connection'] = req1.headers['proxy-connection'];

      // log.info('http %s req2', servicePort, req1.method, x.hostname, x.port || 80);
      var options = {
        method:req1.method,
        host:x.hostname,
        port:x.port || 80,
        agent:soc1.$agent,
        path:req1.url,
        headers:headers};

      log.info('http %s req2', servicePort, options.method, options.host, options.port);
      // log.info('http %s', servicePort, headers);

      var req2 = http.request(options, function response(res2) {
        res1.writeHead(res2.statusCode, res2.statusMessage, res2.headers);
        res2.pipe(res1);
        res2.on('error', function httpres2err(err) {
          log.warn('http %s res2 err', servicePort, err); });
        res2.on('end', function httpres2end(err) {
          --n; log.info('http %s res2 end', servicePort, n); });

        var soc2 = req2.connection;
        if (!soc2.$socketId) soc2.$socketId = socketIdSeq;
        else log.warn('http %s soc2 reused!', servicePort, soc2.$socketId, socketIdSeq);

        soc2.removeAllListeners('error');
        soc2.on('error', function httpsoc2err(err) {
          log.warn('http %s soc2 err', servicePort, err); });

      });

      req1.on('error', function httpreq1err(err) {
        log.warn('http %s req1 err', servicePort, err); });
      req1.on('end', function httpreq1end(err) {
        --n; log.info('http %s req1 end', servicePort, n); });
      req1.pipe(req2);

      req2.on('error', function httpreq2err(err) { // can not connect target!?
        log.warn('http %s req2 err', servicePort, err);
      });
      req2.on('end', function httpreq2end(err) {
        log.info('http %s req2 end', servicePort);
      });
    });

    //======================================================================
    // server on 'connection' / socket
    server.on('connection', function connection(soc1) {
      soc1.$agent = new http.Agent({keepAlive: true})
      log.info('http %s soc1 connection', servicePort);
      soc1.on('error', function (err) {
        log.warn('http %s soc1 connection socket err', servicePort, err);
      });
    });

    //======================================================================
    // server on 'connect' / HTTP CONNECT
    server.on('connect', function connect(req1, soc1, head1) {
      var socketId = ++socketIdSeq;
      if (!soc1.$socketId) soc1.$socketId = socketId;
      else log.warn('htps %s soc1 reused!', servicePort, soc1.$socketId, socketId);

      soc1.removeAllListeners('error');
      soc1.on('error', function (err) { // client disconnect!?
        log.warn('htps %s soc1 err', servicePort, err);
      });
      soc1.removeAllListeners('end');
      soc1.on('end', function () {
        log.warn('htps %s soc1 end', servicePort);
      });

      log.info('htps %s soc1 CONNECT', servicePort, req1.url);
      var hostport = req1.url.split(':'), host = hostport[0], port = hostport[1] || 443;

      var soc2 = net.connect(port, host, function connect() {
        log.info('htps %s soc2 connected', servicePort); });

      if (!soc2.$socketId) soc2.$socketId = socketId;
      else log.fatal('htps %s soc2 reused!', servicePort, soc2.$socketId, socketId);

      //soc2.removeAllListeners('error');
      soc2.on('error', function (err) { // can not connect target!?
        log.warn('htps %s soc2 err', servicePort, err);
      });
      //soc2.removeAllListeners('end');
      soc2.on('end', function () {
        log.warn('htps %s soc2 end', servicePort);
      });

      if (head1 && head1.length) soc2.write(head1);
      soc1.pipe(soc2);
      soc2.pipe(soc1);
    });

    //======================================================================
    // server on 'upgrade' / HTTP UPGRADE
    server.on('upgrade', function upgrade(req1, soc1, head1) {
      log.info('http %s soc1 UPGRADE', servicePort, req1.url); });

    //======================================================================
    // server on 'error'
    server.on('error', function httpServerError(err) {
      log.warn('http %s srvr err', servicePort, err); });

    //======================================================================
    // server on 'clientError'
    server.on('clientError', function clientError(err, soc1) {
      log.warn('http %s srvr clientError', servicePort, err); });

    //======================================================================
    // server listen on 'listening'
    server.listen(servicePort, function listening() {
      log.info('http %s srvr listening', servicePort, server.address()); });

    //======================================================================
    // server socket timeout
    //server.setTimeout(60000 * 3, function timeout() {});
    //server.timeout = 60000 * 3

    //======================================================================
    // server.on('close', function close() {});
    // server.close()

  } // startFwdHttp

  startHttpForward(9990);
  startPortForward(9999, {proxyUrl: 'http://localhost:9998'});
  startPortForward(8888, {proxyUrl: 'http://localhost:9998'});
  startHttpForward(9998);

})();
