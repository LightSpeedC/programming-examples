  'use strict';
  var inFileName = process.argv[2];
  var outFileName = process.argv[3] || (inFileName + '.log');
  if (!inFileName) return console.log('node add2sp {in} {out}');
  var fs = require('fs');
  var lines = fs.readFileSync(inFileName).toString().split('\r\n');
  lines = lines.map(function (line) {
    if (line.length === 0) return line;
    return '  ' + line;
  });
  fs.writeFileSync(outFileName, lines.join('\r\n'));
