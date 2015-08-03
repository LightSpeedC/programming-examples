	inFileName=process.argv[2]
	outFileName=process.argv[3]
	if (!inFileName) return console.log('node add-tab {in} {out}')
	if (!outFileName) outFileName = inFileName + '.log';
	fs=require('fs')
	lines=fs.readFileSync(inFileName).toString().split('\r\n');
	lines=lines.map(function(line){
		if (line.length === 0) return line;
		return '\t' + line;
	});
	fs.writeFileSync(outFileName, lines.join('\r\n'));