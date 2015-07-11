// fwd.js

var fwd = this.fwd = function () {
  'use strict';

  var net = require('net');
  var aa = require('aa');

  var MAX_DUMP_LEN = 800;

  function fwd(config) {
    var socketIdSeq = 0;
    var numConnections = 0;
    var ctxConnections = {};

    var log = require('log-manager').setWriter(new require('log-writer')(config.logFile)).getLogger();
    log.setLevel(config.logLevel);

    var server = net.createServer(function connection(cliSoc) {
      ++numConnections;
      var socketId = ++socketIdSeq;
      var ctx = {socketId:socketId, color:socketId % 6 + 41, 'c->s':[], 'c<-s':[]}
      ctx.updateTime = ctx.startTime = Date.now();
      ctxConnections[socketId] = ctx;
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

    });
    server.listen(config.servicePort, function listening() {
      log.info('%s server listening', config.servicePort);
    });

    log.info('%s config: \x1b[44m%s\x1b[m', config.servicePort, config);

    require('control-c')(
      function () {
        var count = 0;
        for (var i in ctxConnections) {
          var ctx = ctxConnections[i];
          loginfo(ctx, ctx.color, '====', seconds(ctx.updateTime) + ' ' + ctx['c->s']);
          ++count;
        }
        if (count === 0) log.warn('%s ctrl-c: print status: no connections.', config.servicePort);
      },
      function () { log.warn('%s ctrl-c: process.exit();', config.servicePort); process.exit(); });


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
     log.debug('%s \x1b[%sm%s#%s %s:%s\x1b[m %s',
       config.servicePort, color, zz(numConnections), zzz(ctx.socketId),
       msg1, seconds(ctx.startTime), msg2);
    }

    function logwarn(ctx, color, msg1, err, msg2) {
      log.warn('%s \x1b[%sm%s#%s %s:%s\x1b[m err \x1b[41m%s\x1b[m%s', 
        config.servicePort, ctx.color, zz(numConnections), zzz(ctx.socketId),
        msg1, seconds(ctx.startTime), err,
        msg2 ? ' ' + msg2 : '');
    }

    function loginfo(ctx, color, msg1, msg2) {
     log.info('%s \x1b[%sm%s#%s %s:%s\x1b[m %s',
       config.servicePort, color, zz(numConnections), zzz(ctx.socketId),
       msg1, seconds(ctx.startTime), msg2);
    }

    function logtrace(ctx, color, msg1, msg2) {
     log.trace('%s \x1b[%sm%s#%s %s:%s\x1b[m %s',
       config.servicePort, color, zz(numConnections), zzz(ctx.socketId),
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

  return fwd;

}();

  if (require.main === module) {
    require('fs').mkdir('log', function (err) {
      if (err && err.code !== 'EEXIST') console.log(err);
      fwd(require('./config').config);
    });
  }
