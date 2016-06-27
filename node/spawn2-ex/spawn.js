void function () {
	'use strict';

	if (require.main === module) {
		var main = require('./' + (process.argv[2] || 'main'));
		var spawn = require('./' + (process.argv[3] || 'main'));
		var r = spawn(main);
		if (r && r.then) r.then(
			function (v) { console.log('v', v); },
			function (e) { console.log('e', e + ''); });
		else if (typeof r === 'function') r(function (e, v) { console.log('ev', e + '', v); });
	}

} ();
