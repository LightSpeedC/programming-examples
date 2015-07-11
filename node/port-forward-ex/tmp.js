  var fwd = require('./fwd').fwd;

  fwd({servicePort: 9999, forwardPort: 9998,
    logFile: 'log/fwd-%s.log', logLevel: 'trace'});
  fwd({servicePort: 8888, forwardPort: 9998,
    logFile: 'log/fwd-%s.log', logLevel: 'trace'});
