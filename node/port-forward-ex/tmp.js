  var logFile = 'log/fwd-%s.log';
  var logLevel = 'trace';
  var log = require('log-manager').setWriter(new require('log-writer')(logFile)).getLogger();
  log.setLevel(logLevel);

  var fwd = require('./fwd').fwd;
  var fwdHttp = require('./fwd-http').fwdHttp;

  var filters = {
    '127.*;192.168.*;nx-*;t-*;x-*;rsb00*;b000*;kok*-*;*.dev;localhost': 'http://localhost:9990',
    '172.16.*;172.17.*;rssv*;*.group': 'http://localhost:9998',
    '*': 'http://localhost:9998'};

  fwd({log:log, servicePort:9999, proxyUrl:'http://localhost:9995', binaryUrl:'http://localhost:9998'});
  fwd({log:log, servicePort:8888, proxyUrl:'http://localhost:9995', binaryUrl:'http://localhost:9998'});
  fwdHttp({log:log, servicePort:9995, filters:filters});
  fwdHttp({log:log, servicePort:9990}); // direct
  fwdHttp({log:log, servicePort:9998}); // external
