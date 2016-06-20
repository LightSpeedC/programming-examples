void function () {
	'use strict';

	const fs = require('fs');
	var b = fs.readFileSync('xx-e.reg');
	var c = b.toString('UTF16LE');
	var d = new Buffer(c, 'UTF16LE');
	fs.writeFileSync('xxx-e.reg', d);
} ();
