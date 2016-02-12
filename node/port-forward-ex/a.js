(function () {
  'use strict';

  var http = require('http');
  var net = require('net');
  var url = require('url');
  var ControlC = require('control-c');

  var logFile = 'log/a-%s.log';
  var logLevel = 'debug';
  var log = require('log-manager').setWriter(new require('log-writer')(logFile)).getLogger();
  log.setLevel(logLevel);
  var IS_TRACE = log.isTrace();

  var numConnections = 0;
  var ctxConnections = {};
  var ctxDummy = {socketId:'----', servicePort:'----'};
  var socketIdSeq = parseInt('1000', 36);

  log.info('node ' + process.version);

  //======================================================================
  ControlC(
    function () {
      var n = 0;
      for (var i in ctxConnections)
        log.info.apply(log, logs(ctxConnections[i], '===>', ++n, ctxConnections[i].targetInfo));
      if (n === 0)
        log.info.apply(log, logs(ctxDummy, '===>', 0, 'no connections'));
    },
    function () { log.info.apply(log, logs(ctxDummy, '====')); }
  );

  //======================================================================
  function logs(ctx) { return logArgs(ctx, 'ctrl', ctx.servicePort, arguments); }

  //======================================================================
  function Context() {
    ++numConnections;
    this.socketId = ++socketIdSeq;
    ctxConnections[this.socketId] = this;
    this.targetInfo = '';
  }
  Context.prototype.remove = function remove() {
    if (ctxConnections[this.socketId]) {
      --numConnections;
      delete ctxConnections[this.socketId];
    }
  }

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // start port forward
  function startPortForward(servicePort, config) {
    log.info.apply(log, logs(ctxDummy, '@@@@', 'start opt', servicePort, config));

    var proxyUrl = config.proxyUrl;
    if (proxyUrl && proxyUrl.indexOf('://') < 0) proxyUrl = 'http://' + proxyUrl;
    if (proxyUrl)
      var x = url.parse(proxyUrl);
    else
      throw new Error('config.proxyUrl must be specified');

    //======================================================================
    function logs(ctx) { return logArgs(ctx, 'port', servicePort, arguments); }

    //======================================================================
    // net create server. server on 'connetion'
    var server = net.createServer(function connetion(soc1) {
      var ctx = new Context();
      ctx.targetInfo = x.hostname + ':' + x.port;
      ctx.servicePort = servicePort;

      IS_TRACE && log.trace.apply(log, logs(ctx, 'soc1', 'connected'));

      if (!soc1.$socketId) soc1.$socketId = ctx.socketId;
      else IS_TRACE && log.trace.apply(log, logs(ctx, 'soc1', 'reused!', toStr36(soc1.$socketId)));

      var num = 2;
      soc1.on('error', function portsoc1err(err) { // client disconnect!?
        log.warn.apply(log, logs(ctx, 'soc1', 'err', err, ctx.targetInfo));
        portsoc1end();
      });
      function portsoc1end() {
        IS_TRACE && log.trace.apply(log, logs(ctx, 'soc1', 'end', --num));
        if (num === 0) ctx.remove();
        soc2.end();
      }
      soc1.on('end', portsoc1end);

      var soc2 = net.connect(x.port, x.hostname, function connect() {
        IS_TRACE && log.trace.apply(log, logs(ctx, 'soc2', 'connected'));
      });

      if (!soc2.$socketId) soc2.$socketId = ctx.socketIdSeq;
      else log.fatal.apply(log, logs(ctx, 'soc2', 'reused!', toStr36(soc2.$socketId)));

      soc2.on('error', function portsoc2err(err) { // can not connect target!?
        log.warn.apply(log, logs(ctx, 'soc2', 'err', err, ctx.targetInfo));
        portsoc2end();
      });
      function portsoc2end() {
        IS_TRACE && log.trace.apply(log, logs(ctx, 'soc2', 'end', --num));
        if (num === 0) ctx.remove();
        soc1.end();
      }
      soc2.on('end', portsoc2end);
      soc2.pipe(soc1);
      soc1.pipe(soc2);
/*
      soc1.on('data', function (chunk) {
        try { soc2.write(chunk); }
        catch (err) { log.warn.apply(log, logs(ctx, 'soc2', 'err', err, 'write', ctx.targetInfo)); }
      });
      soc2.on('data', function (chunk) {
        try { soc1.write(chunk); }
        catch (err) { log.warn.apply(log, logs(ctx, 'soc1', 'err', err, 'write', ctx.targetInfo)); }
      });
*/
    });

    //======================================================================
    // server listen. server on 'listening'
    server.listen(servicePort, function listening() {
      log.info.apply(log, logs(ctxDummy, 'srvr', 'listening', server.address()));
    });

    //======================================================================
    // server on 'error'
    server.on('error', function portsvrerr(err) {
      log.warn.apply(log, logs(ctxDummy, 'srvr', 'err', err));
    });

    //======================================================================
    // server.on('close', function close() {});
    // server.close()
  }

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // start http forward
  function startHttpForward(servicePort, config) {

    //======================================================================
    function logs(ctx) { return logArgs(ctx, 'http', servicePort, arguments); }

    var filters = [];
    if (config)
      for (var key in config.filters) {
        var rex = new RegExp(key.replace(/,/g, ';').split(';').map(function (host) {
          return '^' + host.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
        }).join('|'));
        //log.info([key, rex, config.filters[key]]);
        log.info.apply(log, logs(ctxDummy, 'filt', config.filters[key], rex));
        filters.push({rex:rex,
          host:config.filters[key] ? url.parse(config.filters[key]).hostname           : null,
          port:config.filters[key] ? Number(url.parse(config.filters[key]).port) || 80 : null})
      }

    //======================================================================
    // http create server. server on 'request'
    var server = http.createServer(function request(req1, res1) {
      var ctx = new Context();
      var x = url.parse(req1.url);
      ctx.targetInfo = x.hostname + ':' + (x.port || 80);
      ctx.servicePort = servicePort;

      var soc1 = req1.connection;

      if (!soc1.$socketId) soc1.$socketId = ctx.socketId;
      else IS_TRACE && log.trace.apply(log, logs(ctx, 'soc1', 'reused!', toStr36(soc1.$socketId)));

      var handler;
      function httpsoc1err(err) {
        log.warn.apply(log, logs(ctx, 'soc1', 'err', err, ctx.targetInfo));
      }
      if (!soc1.$errorHandlers) soc1.$errorHandlers = [];
      while (handler = soc1.$errorHandlers.shift())
        soc1.removeListener('error', handler);
      soc1.on('error', httpsoc1err);
      soc1.$errorHandlers.push(httpsoc1err);

      IS_TRACE && log.trace.apply(log, logs(ctx, 'req1', 'conn', req1.method, req1.url));

      var num = 2;
      res1.on('close', function close() {});
      res1.on('finish', function finish() {
        ctx.remove();
      }); // --count
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

      // TODO req1.headers[] -> req1.rawHeaders[]
      var headers = {};
      for (var i in req1.headers) headers[i] = req1.headers[i];
      delete headers['proxy-connection'];
      if (req1.headers['proxy-connection'])
        headers['connection'] = req1.headers['proxy-connection'];

      // IS_TRACE && log.trace.apply(log, logs(ctx, 'req2', req1.method, x.hostname, x.port || 80));
      var options = {
        method:req1.method,
        host:x.hostname,
        port:x.port || 80,
        agent:soc1.$agent,
        path:req1.url,
        headers:headers};

      for (var i = 0, n = filters.length; i < n; ++i) {
        if (x.hostname.match(filters[i].rex)) {
          log.info.apply(log, logs(ctx, 'req2', x.hostname + ' match', filters[i]));
          if (filters[i].host) options.host = filters[i].host;
          if (filters[i].port) options.port = filters[i].port;
          break;
        }
      }

      log.debug.apply(log, logs(ctx, 'req2', options.method, options.host, options.port));
      // IS_TRACE && log.trace.apply(log, logs(ctx, 'head', headers));

      var req2 = http.request(options, function response(res2) {
        res1.writeHead(res2.statusCode, res2.statusMessage, res2.headers);
        res2.on('data', function (chunk) {
          try { res1.write(chunk); }
          catch (err) { log.warn.apply(log, logs(ctx, 'res1', 'err', err, 'write', ctx.targetInfo)); }
        });
        res2.on('error', function httpres2err(err) {
          log.warn.apply(log, logs(ctx, 'res2', 'err', err, ctx.targetInfo));
          httpres2end();
        });
        res2.on('end', httpres2end);

        var soc2 = req2.connection;
        if (!soc2.$socketId) soc2.$socketId = ctx.socketId;
        else IS_TRACE && log.trace.apply(log, logs(ctx, 'soc2', 'reused!', toStr36(soc2.$socketId)));

        var handler;
        function httpsoc2err(err) {
          log.warn.apply(log, logs(ctx, 'soc2', 'err', err, ctx.targetInfo));
        }
        if (!soc2.$errorHandlers) soc2.$errorHandlers = [];
        while (handler = soc2.$errorHandlers.shift())
          soc2.removeListener('error', handler);
        soc2.on('error', httpsoc2err);
        soc2.$errorHandlers.push(httpsoc2err);

      });

      function httpres2end(err) {
        IS_TRACE && log.trace.apply(log, logs(ctx, 'res2', 'end', --num));
        if (num === 0) ctx.remove();
        res1.end();
      }

      req1.on('error', function httpreq1err(err) {
        log.warn.apply(log, logs(ctx, 'req1', 'err', err, ctx.targetInfo));
        httpreq1end();
      });
      function httpreq1end() {
        IS_TRACE && log.trace.apply(log, logs(ctx, 'req1', 'end', --num));
        if (num === 0) ctx.remove();
        req2.end();
      }
      req1.on('end', httpreq1end);
      req1.on('data', function (chunk) {
        try { req2.write(chunk); }
        catch (err) { log.warn.apply(log, logs(ctx, 'req2', 'err', err, 'write', ctx.targetInfo)); }
      });

      req2.on('error', function httpreq2err(err) { // can not connect target!?
        log.warn.apply(log, logs(ctx, 'req2', 'err', err, ctx.targetInfo));
        httpres2end();
        //httpreq2end();
      });
      //function httpreq2end() {
      //  IS_TRACE && log.trace.apply(log, logs(ctx, 'req2', 'end', --num));
      //  if (num === 0) ctx.remove();
      //  req1.end();
      //}
      //req2.on('end', httpreq2end);
    });

    //======================================================================
    // server on 'connection' / socket
    server.on('connection', function connection(soc1) {
      IS_TRACE && log.trace.apply(log, logs(ctxDummy, 'soc1', 'connection'));
      if (soc1.$agent)
        log.error.apply(log, logs(ctxDummy, 'soc1', 'err', new Error(), 'connection socket err'));
      soc1.$agent = new http.Agent({keepAlive: true});

      function connsoc1err(err) {
        log.warn.apply(log, logs(ctxDummy, 'soc1', 'err', err, 'connection socket err'));
      }
      if (soc1.$errorHandlers)
        log.error.apply(log, logs(ctxDummy, 'soc1', 'err', new Error(), 'connection socket err'));
      soc1.$errorHandlers = [];
      soc1.$errorHandlers.push(connsoc1err);
      soc1.on('error', connsoc1err);
    });

    //======================================================================
    // server on 'connect' / HTTP CONNECT
    server.on('connect', function connect(req1, soc1, head1) {

      //======================================================================
      function logs(ctx) { return logArgs(ctx, 'htps', servicePort, arguments); }

      var ctx = new Context();
      var x = url.parse('https://' + req1.url), host = x.hostname, port = x.port || 443;
      ctx.targetInfo = host + ':' + port;
      ctx.servicePort = servicePort;

      if (!soc1.$socketId) soc1.$socketId = ctx.socketId;
      else IS_TRACE && log.trace.apply(log, logs(ctx, 'soc1', 'reused!', toStr36(soc1.$socketId)));

      var soc2;

      var handler;
      function httpssoc1err(err) { // client disconnect!?
        log.warn.apply(log, logs(ctx, 'soc1', 'err', err, ctx.targetInfo));
        httpssoc1end();
      }
      if (!soc1.$errorHandlers) soc1.$errorHandlers = [];
      while (handler = soc1.$errorHandlers.shift())
        soc1.removeListener('error', handler);
      soc1.on('error', httpssoc1err);
      soc1.$errorHandlers.push(httpssoc1err);

      function httpssoc1end() {
        IS_TRACE && log.trace.apply(log, logs(ctx, 'soc1', 'end'));
        if (soc2) soc2.end();
      }
      if (!soc1.$endHandlers) soc1.$endHandlers = [];
      while (handler = soc1.$endHandlers.shift()) {
        handler();
        soc1.removeListener('end', handler);
      }
      soc1.on('end', httpssoc1end);
      soc1.$endHandlers.push(httpssoc1end);

      log.debug.apply(log, logs(ctx, 'soc1', 'CONNECT', req1.url));
      var useProxy = false;

      // TODO req1.headers[] -> req1.rawHeaders[]
      var headers = {};
      for (var i in req1.headers) headers[i] = req1.headers[i];
      delete headers['proxy-connection'];
      if (req1.headers['proxy-connection'])
        headers['connection'] = req1.headers['proxy-connection'];

      for (var i = 0, n = filters.length; i < n; ++i) {
        if (host.match(filters[i].rex)) {
          log.info.apply(log, logs(ctx, 'soc2', host + ' match', filters[i]));
          if (filters[i].host) host = filters[i].host;
          if (filters[i].port) port = filters[i].port;
          useProxy = true;
          break;
        }
      }

      if (useProxy) {

        var options = {
          method:req1.method,
          host:host,
          port:port,
          agent:soc1.$agent,
          path:req1.url,
          headers:headers};

        var req2 = http.request(options);
        req2.end();
        req2.on('connect', function connect(res2, soc2a, head2) {
          IS_TRACE && log.trace.apply(log, logs(ctx, 'req2', 'connected'));
          soc2 = soc2a; // TODO
          soc1.write('HTTP/1.1 200 Connection established\r\n\r\n');
          if (head1 && head1.length) soc2.write(head1);
          if (head2 && head2.length) soc1.write(head2);
          soc2.pipe(soc1);
          soc1.pipe(soc2);
          soc2.on('end', function () { soc1.end(); });
          soc2.on('error', function (err) {
            log.warn.apply(log, logs(ctx, 'soc2', 'err', err, ctx.targetInfo));
            soc1.end();
          });
        });
        req2.on('error', function (err) {
          log.warn.apply(log, logs(ctx, 'req2', 'err', err, ctx.targetInfo));
          httpssoc2end();
        });

        return;
      }

      soc2 = net.connect(port, host, function connect() {
        IS_TRACE && log.trace.apply(log, logs(ctx, 'soc2', 'connected'));
        soc1.write('HTTP/1.0 200 Connection established\r\n\r\n');
        if (head1 && head1.length) soc2.write(head1);
      });

      if (!soc2.$socketId) soc2.$socketId = ctx.socketId;
      else log.fatal.apply(log, logs(ctx, 'soc2', 'reused!', toStr36(soc2.$socketId)));

      soc2.on('error', function httpssoc1err(err) { // can not connect target!?
        log.warn.apply(log, logs(ctx, 'soc2', 'err', err, ctx.targetInfo));
        httpssoc2end();
      });
      function httpssoc2end() {
        IS_TRACE && log.trace.apply(log, logs(ctx, 'soc2', 'end'));
        ctx.remove();
        soc1.end();
      }
      soc2.on('end', httpssoc2end);

      soc2.pipe(soc1);
      soc1.pipe(soc2);
/*
      soc1.on('data', function (chunk) {
        try { soc2.write(chunk); }
        catch (err) { log.warn.apply(log, logs(ctx, 'soc2', 'err', err, 'write', ctx.targetInfo)); }
      });
      soc2.on('data', function (chunk) {
        try { soc1.write(chunk); }
        catch (err) { log.warn.apply(log, logs(ctx, 'soc1', 'err', err, 'write', ctx.targetInfo)); }
      });
*/
    });

    //======================================================================
    // server on 'upgrade' / HTTP UPGRADE
    server.on('upgrade', function upgrade(req1, soc1, head1) {
      log.error.apply(log, logs(ctxDummy, 'soc1', 'UPGRADE', req1.url));
    });

    //======================================================================
    // server on 'error'
    server.on('error', function httpServerError(err) {
      log.warn.apply(log, logs(ctxDummy, 'srvr', 'err', err));
    });

    //======================================================================
    // server on 'clientError'
    server.on('clientError', function clientError(err, soc1) {
      log.warn.apply(log, logs(ctxDummy, 'srvr', 'err', err, 'clientError'));
    });

    //======================================================================
    // server listen on 'listening'
    server.listen(servicePort, function listening() {
      log.info.apply(log, logs(ctxDummy, 'srvr', 'listening', server.address()));
    });

    //======================================================================
    // server socket timeout
    //server.setTimeout(60000 * 3, function timeout() {});
    //server.timeout = 60000 * 3

    //======================================================================
    // server.on('close', function close() {});
    // server.close()

  } // startFwdHttp

  //======================================================================
  function logArgs(ctx, box, servicePort, args) {
    return ['%s %s %s', toColor(servicePort), toStr36(ctx.socketId), box, numConnections].concat([].slice.call(args, 1));
  }

  function toColor(x) {
    return typeof x === 'number'? x = '\x1b[' + (41 + (x % 6)) + 'm' + x + '\x1b[m' : x;
  }

  function toStr36(x) {
    return typeof x === 'number'? x = '\x1b[' + (41 + (x % 6)) + 'm' + x.toString(36) + '\x1b[m' : x;
  }

  var filters = {
    '127.\\d+.\\d+.\\d+;192.168.\\d+.\\d+;localhost':  'http://localhost:9990',
    'nx-*;t-*;x-*;rsb00*;b000*;kok*-*;*.dev':          'http://localhost:9990',
    'rssv066*':                                        'http://localhost:9990',
    '172.17.66.\\d+;172.17.65.\\d+':                   'http://localhost:9990',
    '172.16.\\d+.\\d+;172.17.\\d+.\\d+;rssv*;*.group': 'http://localhost:9998',
    //'\\d+.\\d+.\\d+.\\d+': null,
    '*': 'http://localhost:9998'};

  startHttpForward(9990);
  if (process.argv[2] !== 'PORT') {
    startHttpForward(9999, {filters: filters});
    startHttpForward(8888, {filters: filters});
  }
  else {
    startPortForward(9999, {proxyUrl: 'http://localhost:9998'});
    startPortForward(8888, {proxyUrl: 'http://localhost:9998'});
  }
  startHttpForward(9998);

})();
