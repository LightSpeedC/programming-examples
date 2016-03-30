	'use strict';
	var NEWLINE = process.platform === 'win32' ? '\r\n' : '\n';
	var inFileName = process.argv[2];
	var outFileName = process.argv[3] || (inFileName + '.log');
	var numSpaces = Number(process.argv[4] || 2);
	if (!inFileName)
		return console.log('node tab2space {in} {out=in.log} {numSpaces=2}');
	var fs = require('fs');
	var lines = fs.readFileSync(inFileName).toString().split(NEWLINE);
	lines = lines.map(function (line) {
		for (var i = 0; i < line.length; ++i)
			if (line.charAt(i) !== '\t') break;
		if (i < line.length)
			return [].map.call(line.substr(0, i),
				function () {
					return '        '.substr(0, numSpaces);
				}).join('') + line.substr(i);
		return line;
	});
	fs.writeFileSync(outFileName, lines.join(NEWLINE));
