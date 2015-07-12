  var logFile = 'log/fwd-%s.log';
  var logLevel = 'trace';
  var log = require('log-manager').setWriter(new require('log-writer')(logFile)).getLogger();
  log.setLevel(logLevel);

  var fwd = require('./fwd').fwd;
  var fwdHttp = require('./fwd-http').fwdHttp;

  var filters = {
    '192.168.*;kok*-*': 'http://localhost:9997',
  };

  fwd({log:log, servicePort:9999, proxyUrl:'http://localhost:9995', binaryUrl:'http://localhost:9998'});
  fwd({log:log, servicePort:8888, proxyUrl:'http://localhost:9995', binaryUrl:'http://localhost:9998'});
  fwdHttp({log:log, servicePort:9995, proxyUrl:'http://localhost:9998', filters:filters});
  fwdHttp({log:log, servicePort:9997}); // direct
  fwdHttp({log:log, servicePort:9998}); // external
