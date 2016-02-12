// json-stringify-tab.js

var cfg = require('./default-config')('local-config', 'config', '\t');

var str = JSON.stringify(cfg, null, '\t');
console.log('main:', str);
