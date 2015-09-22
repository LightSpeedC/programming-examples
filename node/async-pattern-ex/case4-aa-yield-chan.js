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

	var procs = require('./procs');
	var aa = require('aa');

	aa(function *() {
		procs.info('start**', '');
		try {
			var val = yield main();
			procs.info('final', val);
		} catch (err) {
			procs.error('final', err);
		}
		procs.info('final**', '');
	});

//	aa(main()).then(
//		function (val) { procs.info('final', val); },
//		function (err) { procs.error('final', err); });

	function *main() {
		var chanA = aa();
		var chanB = aa();
		var chanC = aa();

		procs.procA('A', chanA);
		procs.procB('B', chanB);
		var channels = [chanA, chanB];
		for (var x = 0, m = Math.random() * 3 + 2; x < m; ++x) {
			var chanX = aa();
			procs.procX('X' + x, chanX);
			channels.push(chanX);
		}

		try {
			var result = yield channels;
		} catch (err) {
			procs.error('err1*', err);
			throw err;
		}

		procs.procC('C:' + result.join(','), chanC);

		try {
			var val = yield chanC;
			procs.info('end* ', val);
		} catch (err) {
			procs.error('err2*', err);
			throw err;
		}

		return 'ok';
	}

})();
