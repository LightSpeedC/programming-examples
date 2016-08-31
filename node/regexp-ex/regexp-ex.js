void function () {
	'use strict';

	const fs = require('fs');
	const util = require('util');

	const s = process.argv[2] || 'reg*.js';
	const s2 = s.replace('.', '\\.').replace('*', '.*');
	const rex = new RegExp(s2);

	console.log(s, s2, util.inspect(rex, {colors:true}));

	fs.readdirSync('.').forEach(x => console.log(x, rex.test(x)));
} ();
