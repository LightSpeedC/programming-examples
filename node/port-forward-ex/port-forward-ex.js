// port-forward-ex.js

(function () {
  'use strict';

  var net = require('net');
  var aa = require('aa');

  var MAX_DUMP_LEN = 800;
  var socketIdSeq = 0;
  var numConnections = 0;

  var config = require('./config').config;
  var log = require('log-manager').setWriter(new require('log-writer')(config.logFile)).getLogger();
  log.setLevel(config.logLevel);

  var server = net.createServer(function connection(cliSoc) {
    aa(function * () {
      ++numConnections;
      var socketId = ++socketIdSeq;
      try {
        var ctx = {socketId:socketId, color:socketId % 6 + 41, startTime:Date.now()};
        log.info('\x1b[%sm%s#%s ++ connected!\x1b[m',
          ctx.color, zz(numConnections), zzz(socketId));
        var svrSoc = net.connect(config.forwardPort); // 'connect' event ignored
        svrSoc.on('error', function (err) {
          log.warn('\x1b[%sm%s#%s %s: ????? \x1b[m %s', 
            ctx.color, zz(numConnections), zzz(socketId), 'c<=s err ', err);
        });
        yield [soc2soc(svrSoc, cliSoc, 'c<-s', ctx, ctx.color),
               soc2soc(cliSoc, svrSoc, 'c->s', ctx, ctx.color + ';30;5')];
      } catch (err) {
        log.warn('\x1b[%sm%s#%s %s: \x1b[m %s', 
           ctx.color, zz(numConnections), zzz(socketId), 'c<>s err', err);
      }
      --numConnections;
      var ms = ((Date.now() - ctx.startTime)/1000.0).toFixed(3);
      log.info('\x1b[%sm%s#%s -- disconnect %s s\x1b[m',
        ctx.color, zz(numConnections), zzz(socketId), ms);
      cliSoc.end(); svrSoc.end();
    });

  });
  server.listen(config.servicePort, function listening() {
    log.info('server bound. port: %s', config.servicePort);
  });

  log.info(config);

  // thread: reader -> writer
  function * soc2soc(reader, writer, msg, ctx, color) {
    var chan = aa().stream(reader), buff = null, count = 0;
    var socketId = ctx.socketId;
    try {
      while(buff = yield chan) {
        if (count++ <= 0) {
          var ms = ((Date.now() - ctx.startTime)/1000.0).toFixed(3);
          buff2str(buff).split('\r\n').forEach(function (str) {
            var low = str.substr(0, 90).toLowerCase();
            if (low.indexOf('connection:') >= 0) return;
            if (low.indexOf('content-') == 0) return;
            if (low.indexOf('accept') == 0) return;
            if (low.indexOf('application') == 0) return;
            if (low.indexOf('host:') >= 0) return;
            if (low.indexOf('via:') >= 0) return;
            if (low.indexOf('csp:') >= 0) return;
            if (low.indexOf('cookie') >= 0) return;
            if (low.indexOf('access') == 0) return;
            if (low.indexOf('x-') == 0) return;
            if (low.indexOf('pragma:') == 0) return;
            if (low.indexOf('cache-') == 0) return;
            if (low.indexOf('vary:') == 0) return;
            if (low.indexOf('date:') == 0) return;
            if (low.indexOf('etag:') == 0) return;
            if (low.indexOf('last-') == 0) return;
            if (low.indexOf('appex-') == 0) return;
            if (low.indexOf('age:') == 0) return;
            log.trace('\x1b[%sm%s#%s %s: %s s\x1b[m %s',
              color, zz(numConnections), zzz(socketId), msg, ms, str.substr(0, 90));
          });
        }
        writer.write(buff);
        buff = null;
      }
    } catch (err) {
      var ms = ((Date.now() - ctx.startTime)/1000.0).toFixed(3);
      log.warn('\x1b[%sm%s#%s %s: %s s %s err \x1b[m %s', 
        color, zz(numConnections), zzz(socketId), msg, ms, buff ? 'write' : 'read', err);
    }
    reader.end();
    writer.end();
  }

  function zz(x) {
    return ('0' + x).substr(-2);
  }
  function zzz(x) {
    return ('00' + x.toString(26)).substr(-3);
  }

  function err2str(err) {
    return err + '';
    //return !!err && err.stack || (err + '');
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

  require('control-c')(
    function () { console.log('ctrl-c'); },
    function () { console.log('server.close();'); server.close(); },
    function () { console.log('process.exit();'); process.exit(); });

})();
