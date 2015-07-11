// fwd-http.js

var fwdHttp = this.fwdHttp = function () {
  'use strict';

  var http = require('http');
  var net = require('net');
  var url = require('url');
  var aa = require('aa');

  var MAX_DUMP_LEN = 800;

  var socketIdSeq = 0;

  function fwdHttp(config) {
    var numConnections = 0;
    var ctxConnections = {};

    // var HTTP_PORT = config.servicePort;  // internal proxy server port
    var PROXY_URL = config.proxyUrl;     // external proxy server URL
    var PROXY_HOST = PROXY_URL ?  url.parse(PROXY_URL).hostname    : null;
    var PROXY_PORT = PROXY_URL ? (Number(url.parse(PROXY_URL).port) || 80) : null;
    var PORT_COLOR = config.servicePort % 6 + 41;

    var log = require('log-manager').setWriter(new require('log-writer')(config.logFile)).getLogger();
    log.setLevel(config.logLevel);

    var server = http.createServer(function connection(cliReq, cliRes) {
      ++numConnections;
      var socketId = ++socketIdSeq;
      var ctx = {socketId:socketId, color:socketId % 6 + 41, 'c->s':[], 'c<-s':[]}
      ctx.updateTime = ctx.startTime = Date.now();
      ctxConnections[socketId] = ctx;

      aa(function *() { // TODO indent

        var cliSoc = cliReq.socket || cliReq.connection;
        var x = url.parse(cliReq.url);
        loginfo(ctx, ctx.color + ';30;5', cliReq.method,
            x.hostname + ':' + (x.port || 80));

        // request headers 要求ヘッダ
        var reqHeaders = {};
        for (var i = 0; i < cliReq.rawHeaders.length; i += 2)
          reqHeaders[cliReq.rawHeaders[i]] = cliReq.rawHeaders[i + 1];
        logdebug(ctx, ctx.color + ';30;5', 'headr', cliReq.headers['user-agent'] || cliReq.headers['host']);

        // proxy or direct
        if (PROXY_URL)
          var options = {host: PROXY_HOST, port: PROXY_PORT, path: cliReq.url,
                         method: cliReq.method, headers: reqHeaders, agent: cliSoc.$agent};
        else
          var options = {host: x.hostname, port: x.port || 80, path: x.path,
                         method: cliReq.method, headers: reqHeaders, agent: cliSoc.$agent};
        log.info('\x1b[%sm%s\x1b[m', PORT_COLOR, config.servicePort, options.method, options.host, options.port, options.path);

        var genChan = aa();

        // send request 要求を送信
        var svrReq = http.request(options, genChan);
        cliReq.pipe(svrReq);
        svrReq.on('error', function (err) {
          logwarn(ctx, ctx.color, 'c->s', err);
        });
        var svrRes = yield genChan;

        // response headers 応答ヘッダ
        var resHeaders = {};
        for (var i = 0; i < svrRes.rawHeaders.length; i += 2)
          resHeaders[svrRes.rawHeaders[i]] = svrRes.rawHeaders[i + 1];

        // 応答ヘッダに Date が無ければ、そのまま // TODO???
        cliRes.sendDate = false;

        // ステータスメッセージ
        if (svrRes.statusMessage)
          cliRes.writeHead(svrRes.statusCode, svrRes.statusMessage, resHeaders);
        else
          cliRes.writeHead(svrRes.statusCode, resHeaders);

        // サーバ応答を、クライアント応答へ流す
        svrRes.pipe(cliRes);
        return;

      }); // aa // TODO indent

/*
      aa(function * () {
        try {
          logdebug(ctx, ctx.color + ';30;5', '++++', 'connected!');
          var svrSoc = net.connect(config.forwardPort); // 'connect' event ignored
          yield [soc2soc(ctx, svrSoc, cliSoc, 'c<-s', ctx.color),
                 soc2soc(ctx, cliSoc, svrSoc, 'c->s', ctx.color + ';30;5')];
        } catch (err) {
          logwarn(ctx, ctx.color, 'c<>s', err);
        }
        --numConnections;
        logdebug(ctx, ctx.color, '----', 'disconnect \x1b[90m' + ctx['c->s'][0] + '\x1b[m');
        cliSoc.end(); svrSoc.end();
        delete ctxConnections[ctx.socketId];
      });
*/

    });
    server.listen(config.servicePort, function listening() {
      log.info('\x1b[%sm%s\x1b[m server listening', PORT_COLOR, config.servicePort);
    });

    // HTTP CONNECT request コネクト要求
    server.on('connect', function onCliConn(cliReq, cliSoc, cliHead) {
      ++numConnections;
      var socketId = ++socketIdSeq;
      var ctx = {socketId:socketId, color:socketId % 6 + 41, 'c->s':[], 'c<-s':[]}
      ctx.updateTime = ctx.startTime = Date.now();
      ctxConnections[socketId] = ctx;

      // コネクト要求のURLは server:port 形式
      var x = url.parse('https://' + cliReq.url);
      loginfo(ctx, ctx.color, 'https', cliReq.url);

      // request headers 要求ヘッダ
      var reqHeaders = {};
      for (var i = 0; i < cliReq.rawHeaders.length; i += 2)
        reqHeaders[cliReq.rawHeaders[i]] = cliReq.rawHeaders[i + 1];

      logdebug(ctx, ctx.color, 'headr', cliReq.headers['user-agent'] || cliReq.headers['host']);

      // proxy or direct
      if (PROXY_HOST) {
        var options = {host: PROXY_HOST, port: PROXY_PORT, path: cliReq.url,
                       method: cliReq.method, headers: reqHeaders, agent: cliSoc.$agent};
        var svrReq = http.request(options);
        if (cliSoc.$serverRequested)
          logwarn(ctx, ctx.color, 'https', 'server requested! twice!');
        cliSoc.$serverRequested = true;
        svrReq.end();
        var svrSoc = null;
        svrReq.on('connect', function onSvrConn(svrRes, svrSoc2, svrHead) {
          svrSoc = svrSoc2;
          cliSoc.write('HTTP/1.1 200 Connection established\r\n\r\n');
          if (cliHead && cliHead.length) svrSoc.write(cliHead);
          if (svrHead && svrHead.length) cliSoc.write(svrHead);
          svrSoc.pipe(cliSoc);
          cliSoc.pipe(svrSoc);
          svrSoc.on('end', function () {
            if (!cliSoc.$serverRequested)
              logwarn(ctx, ctx.color, 'https', 'server request false! twice!');
            cliSoc.$serverRequested = false;
          }); // soc on end
          svrSoc.on('error', funcOnSocErr(ctx, 'svrSoc', cliReq.url));
        }); // on connect
        svrReq.on('error', funcOnSocErr(ctx, 'svrRq2', cliReq.url));
      } // if PROXY_HOST
      else {
        var svrSoc = net.connect(x.port || 443, x.hostname, function onSvrConn() {
          cliSoc.write('HTTP/1.1 200 Connection established\r\n\r\n');
          if (cliHead && cliHead.length) svrSoc.write(cliHead);
          cliSoc.pipe(svrSoc);
        });
        svrSoc.pipe(cliSoc);
        svrSoc.on('error', funcOnSocErr(ctx, 'svrSoc', cliReq.url));
      } // else PROXY_HOST

      cliSoc.removeAllListeners('error');
      cliSoc.on('error', function onCliSocErr(err) {
        logwarn(ctx, ctx.color, 'https', err, cliReq.url);
      });

    });

    log.info('\x1b[%sm%s\x1b[m config: \x1b[44m%s\x1b[m', PORT_COLOR, config.servicePort, config);

    server.on('connection', function onConn(cliSoc) {
      // http Agent エージェント
      cliSoc.$agent = new http.Agent({keepAlive: true});
      cliSoc.$serverRequested = false;

      cliSoc.$agent.on('error', function onAgentErr(err) {
        log.warn('agent err', err);
      });
    });

    require('control-c')(
      function () {
        var count = 0;
        for (var i in ctxConnections) {
          var ctx = ctxConnections[i];
          loginfo(ctx, ctx.color, '====', seconds(ctx.updateTime) + ' ' + ctx['c->s']);
          ++count;
        }
        if (count === 0)
          log.warn('\x1b[%sm%s\x1b[m ctrl-c: print status: no connections.', PORT_COLOR, config.servicePort);
      },
      function () {
        log.warn('\x1b[%sm%s\x1b[m ctrl-c: process.exit();', PORT_COLOR, config.servicePort); process.exit();
      });

    function funcOnSocErr(ctx, msg, url) {
      return function onSocErr(err) {
        logwarn(ctx, ctx.color, msg, err, url);
      };
    }

    // thread: reader -> writer
    function * soc2soc(ctx, reader, writer, msg, color) {
      var chan = aa().stream(reader), buff = null, count = 0;
      try {
        while(buff = yield chan) {
          ctx.updateTime = Date.now();
          if (count++ <= 0) {
            buff2str(buff).split('\r\n').forEach(function (str, i) {
              var low = str.substr(0, 90).toLowerCase();
              if (i === 0 ||
                  low.startsWith('user-agent:') ||
                  low.startsWith('server:')) {
                logtrace(ctx, color, msg, str.substr(0, 90));
                if (i === 0) ctx[msg] = [];
                ctx[msg].push(str);
              }
            });
          }
          else {
            var str = buff2str(buff);
            if (str.startsWith('HTTP/') ||
                str.startsWith('CONNECT ') ||
                str.startsWith('GET http') ||
                str.startsWith('POST http') ||
                str.startsWith('PUT http') ||
                str.startsWith('DELETE http') ||
                str.startsWith('HEAD http') ||
                str.startsWith('OPTIONS http')) {

              str.split('\r\n').forEach(function (str, i) {
                var low = str.substr(0, 90).toLowerCase();
                if (i === 0 ||
                    low.startsWith('user-agent:') ||
                    low.startsWith('server:')) {
                  logtrace(ctx, color, msg, str.substr(0, 90));
                  if (i === 0) ctx[msg] = [];
                  ctx[msg].push(str);
                }
              });

            }
          }
          writer.write(buff);
          buff = null;
        }
      } catch (err) {
        logwarn(ctx, color, msg, err, buff ? 'write' : 'read');
      }
      writer.end();
    }

    function logdebug(ctx, color, msg1, msg2) {
     log.debug('\x1b[%sm%s\x1b[m \x1b[%sm%s#%s %s:%s\x1b[m %s',
       PORT_COLOR, config.servicePort, color, zz(numConnections), zzz(ctx.socketId),
       msg1, seconds(ctx.startTime), msg2);
    }

    function logwarn(ctx, color, msg1, err, msg2) {
      log.warn('\x1b[%sm%s\x1b[m \x1b[%sm%s#%s %s:%s\x1b[m err \x1b[41m%s\x1b[m%s', 
        PORT_COLOR, config.servicePort, ctx.color, zz(numConnections), zzz(ctx.socketId),
        msg1, seconds(ctx.startTime), err,
        msg2 ? ' ' + msg2 : '');
    }

    function loginfo(ctx, color, msg1, msg2) {
     log.info('\x1b[%sm%s\x1b[m \x1b[%sm%s#%s %s:%s\x1b[m %s',
       PORT_COLOR, config.servicePort, color, zz(numConnections), zzz(ctx.socketId),
       msg1, seconds(ctx.startTime), msg2);
    }

    function logtrace(ctx, color, msg1, msg2) {
     log.trace('\x1b[%sm%s\x1b[m \x1b[%sm%s#%s %s:%s\x1b[m %s',
       PORT_COLOR, config.servicePort, color, zz(numConnections), zzz(ctx.socketId),
       msg1, seconds(ctx.startTime), msg2);
    }

  }

  function zz(x) {
    return ('0' + x).substr(-2);
  }
  function zzz(x) {
    return ('000' + x.toString(26)).substr(-4);
  }
  function seconds(startTime) {
    var s = ((Date.now() - startTime)/1000.0).toFixed(3) + ' s';
    return ('   ' + s).substr(- Math.max(s.length, 10))
  }

  var buff2strx = 41;
  function buff2str(buff) {
    if (!buff) return '<>';
    var str = '';
    var n = Math.min(buff.length, MAX_DUMP_LEN);
    var i = buff.indexOf('\r\n\r\n');
    if (i >= 0) n = Math.min(n, i);
    for (var i = 0; i < n; ++i) {
      var c = buff[i];
      if (c >= 0x20 && c <= 0x7E || c === 0x0D || c === 0x0A)
        str += String.fromCharCode(c);
      else {
        buff2strx = 41 + 42 - buff2strx;
        str += '\x1b[' + buff2strx + 'm' + ('0' + c.toString(16).toUpperCase()).slice(-2) + '\x1b[m';
      }
    }
    return str;
  }

  return fwdHttp;

}();

  if (require.main === module) {
    require('fs').mkdir('log', function (err) {
      if (err && err.code !== 'EEXIST') console.log(err);
      //fwdHttp(require('./config-proxy').config);
      fwdHttp({servicePort: 9999, proxyUrl: 'http://localhost:9997',
        logFile: 'log/proxy-%s.log', logLevel: 'trace'});
      fwdHttp({servicePort: 9997,
        logFile: 'log/proxy-%s.log', logLevel: 'trace'});
      fwdHttp({servicePort: 8888, proxyUrl: 'http://localhost:9998',
        logFile: 'log/proxy-%s.log', logLevel: 'trace'});
    });
  }
