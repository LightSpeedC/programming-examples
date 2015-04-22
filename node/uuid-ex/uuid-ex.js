// http://d.hatena.ne.jp/gidooom+TK/20140219/1392809157
// https://github.com/broofa/node-uuid

var uuid = require('node-uuid');
console.log(uuid.v1()); // generate RFC4122 v1 (timestamp-based) UUID.
console.log(uuid.v4()); // Generate and return a RFC4122 v4 (random) UUID.
