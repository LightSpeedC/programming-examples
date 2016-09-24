	'use strict';
	var NEWLINE = '\n';
	var inFileName = process.argv[2];
	var outFileName = process.argv[3] || (inFileName + '.log');
	var numSpaces = Number(process.argv[4] || 2);
	if (!inFileName) return console.log('node space2tab {in} {out=in.log} {numSpaces=2}');
	var fs = require('fs');
	var lines = fs.readFileSync(inFileName).toString().split(NEWLINE);
	lines = lines.map(function (line) {
		if (line.length < numSpaces) return line;
		for (var i = 0; i < line.length; ++i)
			if (line.charAt(i) !== ' ') break;
		if (i < line.length)
			return [].map.call(line.substr(0, i / numSpaces),
				function () { return '\t'; }).join('') +
				line.substr(Math.floor(i / numSpaces) * numSpaces);
		return line;
	});
	fs.writeFileSync(outFileName, lines.join(NEWLINE));
