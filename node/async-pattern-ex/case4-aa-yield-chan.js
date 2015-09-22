// aa: yield chan

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
		var chanA = aa();
		var chanB = aa();
		var chanC = aa();

		lib.procA('A', chanA);
		lib.procB('B', chanB);
		var channels = [chanA, chanB];
		for (var x = 0, m = Math.random() * 3 + 2; x < m; ++x) {
			var chanX = aa();
			lib.procX('X' + x, chanX);
			channels.push(chanX);
		}

		try {
			var result = yield channels;
		} catch (err) {
			lib.error('err1*', err);
			throw err;
		}

		lib.procC('C:' + result.join(','), chanC);

		try {
			var val = yield chanC;
			lib.info('end* ', val);
		} catch (err) {
			lib.error('err2*', err);
			throw err;
		}

		return 'ok';
	}

})();
