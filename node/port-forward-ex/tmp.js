  var logFile = 'log/fwd-%s.log';
  var logLevel = 'trace';
  var log = require('log-manager').setWriter(new require('log-writer')(logFile)).getLogger();
  log.setLevel(logLevel);

  var fwd = require('./fwd').fwd;
  var fwdHttp = require('./fwd-http').fwdHttp;

  fwd({servicePort: 9999, proxyUrl: 'http://localhost:9997',
    log:log, logFile:logFile, logLevel:logLevel});
  fwd({servicePort: 8888, proxyUrl: 'http://localhost:9997',
    log:log, logFile:logFile, logLevel:logLevel});
  fwdHttp({servicePort: 9997, proxyUrl: 'http://localhost:9998',
    log:log, logFile:logFile, logLevel:logLevel});
  fwdHttp({servicePort: 9998,
    log:log, logFile:logFile, logLevel:logLevel});
