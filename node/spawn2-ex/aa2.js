void function () {
	'use strict';

	module.exports = spawn;

	var spawn = require('aa/aa02');

	if (require.main === module) {
		var main = require('./' + (process.argv[2] || 'main'));
		var r = spawn(main);
		if (r && r.then) r.then(
			function (v) { console.log('v', v); },
			function (e) { console.log('e', e + ''); });
		else if (typeof r === 'function') r(function (e, v) { console.log('ev', e + '', v); });
	}

} ();
