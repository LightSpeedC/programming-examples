(function () {
  var net = require('net');
  var aa = require('aa');
  var config = require('./config').config;
  var chan = require('./chan');

  var server = net.createServer(function(svrSoc) {
    //'connection' listener
    console.log('server connected');

    var cliSoc = net.connect(config.forwardPort, function () {});

    aa(function * () {
      try {
        yield [aa(soc2soc, svrSoc, cliSoc, 'svr2cliSoc'),
               aa(soc2soc, cliSoc, svrSoc, 'cli2svrSoc')];
      } catch (err) { error(err, 'main'); }
      cliSoc.end();
      svrSoc.end();
    });

  });
  server.listen(config.servicePort, function() {
    //'listening' listener
    console.log('server bound. port: %s', config.servicePort);
  });

  console.log(config);

  // thread: soc1 -> soc
  function * soc2soc(soc1, soc, msg) {
    var ch = chan().stream(soc1);
    while(!ch.done()) {
      try { var buff = yield ch; } catch (err) { return soc.end(), error(err, msg); }
      if (buff === ch.empty) { //error('ch is empty', msg); 
        break; }
      try { soc.write(buff);     } catch (err) { return soc.end(), console.error(buff), error(err, msg); }
    }
    soc.end();
  }

  function error(err, msg) {
    console.error('\x1b[45m%s: %s\x1b[m', msg, err2str(err));
    return err;
  }

  function err2str(err) {
    return !!err && err.stack || (err + '');
  }

})();
