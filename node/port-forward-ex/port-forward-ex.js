// port-forward-ex.js

(function () {
  'use strict';

  var net = require('net');
  var aa = require('aa');
  var config = require('./config').config;
  var MAX_DUMP_LEN = 360;

  var server = net.createServer(function(cliSoc) {
    //'connection' listener
    //console.log('server connected');

    var svrSoc = net.connect(config.forwardPort, function () {});

    aa(function * () {
      try {
        yield [aa(soc2soc(svrSoc, cliSoc, 'cli<-svr')),
               aa(soc2soc(cliSoc, svrSoc, 'cli->svr'))];
      } catch (err) { error(err, 'main'); }
      cliSoc.end(), svrSoc.end();
    });

  });
  server.listen(config.servicePort, function() {
    //'listening' listener
    console.log('server bound. port: %s', config.servicePort);
  });

  console.log(config);

  // thread: reader -> writer
  function * soc2soc(reader, writer, msg) {
    var chan = aa().stream(reader), buff = null, count = 0;
    try {
      while(buff = yield chan) {
        if (count++ <= 0) console.error('%s: (%s) %s', msg, count, buff2str(buff));
        writer.write(buff), buff = null;
      }
    } catch (err) {
      if (buff !== null) console.error('%s: (%s) %s', msg, typeof buff, buff2str(buff));
      //console.log('%s: %s: %s', msg, err.constructor.name, err.message);
      error(err, msg);
    }
    reader.end(), writer.end();
  }

  function error(err, msg) {
    console.error('\x1b[45m%s: %s\x1b[m', msg, err2str(err));
    return err;
  }

  function err2str(err) {
    return err + '';
    //return !!err && err.stack || (err + '');
  }

  var buff2strx = 41;
  function buff2str(buff) {
    if (!buff) return '<>';
    var str = '<';
    var n = Math.min(buff.length, MAX_DUMP_LEN);
    //if (n > MAX_DUMP_LEN) n = MAX_DUMP_LEN;
    //n = Math.min(n, MAX_DUMP_LEN);
    for (var i = 0; i < n; ++i) {
      var c = buff[i];
      if (c >= 0x20 && c <= 0x7E) str += String.fromCharCode(c);
      else {
        buff2strx = 41 + 42 - buff2strx;
        str += '\x1b[' + buff2strx + 'm' + ('0' + c.toString(16).toUpperCase()).slice(-2) + '\x1b[m';
      }
    }
    return str + '>';
  }

  require('control-c')(
    function () { console.log('ctrl-c'); },
    function () { console.log('server.close();'); server.close(); },
    function () { console.log('process.exit();'); process.exit(); });

})();
