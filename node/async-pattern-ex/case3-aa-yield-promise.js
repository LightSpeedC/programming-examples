// aa: yield promise

(function () {
	'use strict';

	// FLOW:
	// start -->*--> procA --->*--> procC --> end
	//          +--> procB --->+
	//          +--> procX0 -->+
	//          +--> procX1 -->+
	//          |    . . .     |
	//          +--> procXm -->+

	var lib = require('./lib').lib;
	var aa = require('aa');

	for (var p in lib)
		if (p.substr(0, 4) === 'proc' &&
				typeof lib[p] === 'function')
			lib[p] = aa(lib[p]);

	aa(function *() {
		lib.log('start**', '');

		try {
			var val = yield main();
			lib.info('final', val);
		} catch (err) {
			lib.error('final', err);
		}

		lib.log('final**', '');
	});

	function *main() {
		var promises = [
			lib.procA('A'),
			lib.procB('B')
		];
		for (var x = 0, m = Math.random() * 3 + 2; x < m; ++x) {
			promises.push(lib.procX('X' + x));
		}

		try {
			var result = yield promises;
		} catch (err) {
			lib.error('err1*', err);
			throw err;
		}

		try {
			var val = yield lib.procC('C:' + result.join(','));
			lib.info('end* ', val);
		} catch (err) {
			lib.error('err2*', err);
			throw err;
		}

		return 'ok';
	}

})();
