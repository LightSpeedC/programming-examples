'use strict';

const fs = require('fs');
let file = process.argv[2];
let reader = process.stdin;

const LineParser = require('./line-parser');

if (file) reader = fs.createReadStream(file);

//reader = reader.pipe(process.stdout);
reader = reader.pipe(new LineParser);

reader.on('end', () => process.exit());

reader.on('data', data => {
	if (data.toString().trim() === '\x1A')
		process.exit();
	console.log(data.toString().trimRight());
});
