  var fwd = require('./fwd').fwd;
  var fwdHttp = require('./fwd-http').fwdHttp;

  fwd({servicePort: 9999, forwardPort: 9997,
    logFile: 'log/fwd-%s.log', logLevel: 'trace'});
  fwd({servicePort: 8888, forwardPort: 9997,
    logFile: 'log/fwd-%s.log', logLevel: 'trace'});
  fwdHttp({servicePort: 9997, proxyUrl: 'http://localhost:9998',
    logFile: 'log/proxy-%s.log', logLevel: 'trace'});
