void function () {
	'use strict';

	var fs = require('fs');
	var DumpBuffer = require('./dump-buffer');
	var dumpBuffer = new DumpBuffer();

	var file = process.argv[2] || 'package.json';

	var buf = fs.readFileSync(file);

	dumpBuffer.dump(new Buffer([0x30, 0x42, 0x30]), 'あ');
	dumpBuffer.dump(new Buffer([0x44, 0x30, 0x46]));

	dumpBuffer = new DumpBuffer();
	dumpBuffer.dump(buf, 'File');

}();
