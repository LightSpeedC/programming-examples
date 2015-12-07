void function () {
	'use strict';

	var fs = require('fs');
	var dumpBuffer = require('./dump-buffer');

	var file = process.argv[2] || 'package.json';

	var buf = fs.readFileSync(file);
	dumpBuffer(buf);

}();
