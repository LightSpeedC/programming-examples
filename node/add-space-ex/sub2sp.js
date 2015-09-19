  'use strict';
  var inFileName = process.argv[2];
  var outFileName = process.argv[3] || (inFileName + '.log');
  if (!inFileName) return console.log('node sub2sp {in} {out}');
  var fs = require('fs');
  var lines = fs.readFileSync(inFileName).toString().split('\r\n');
  lines = lines.map(function (line) {
    if (line.length < 2) return line;
    if (line.substr(0, 2) === '  ') return line.substr(2);
    return line;
  });
  fs.writeFileSync(outFileName, lines.join('\r\n'));
