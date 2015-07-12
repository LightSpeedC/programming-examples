  var logFile = 'log/fwd-%s.log';
  var logLevel = 'trace';
  var log = require('log-manager').setWriter(new require('log-writer')(logFile)).getLogger();
  log.setLevel(logLevel);

  var fwd = require('./fwd').fwd;
  var fwdHttp = require('./fwd-http').fwdHttp;

  var filters = {
    '192.168.*;kok*-*': 'http://localhost:9996',
  };

  fwd({log:log, servicePort: 9999, proxyUrl: 'http://localhost:9997', filters:filters});
  fwd({log:log, servicePort: 8888, proxyUrl: 'http://localhost:9997', filters:filters});
  fwdHttp({log:log, servicePort: 9996});
  fwdHttp({log:log, servicePort: 9997, proxyUrl: 'http://localhost:9998'});
  fwdHttp({log:log, servicePort: 9998});
