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

	var procs = require('./procs');
	var aa = require('aa');

	function *main() {
		var promises = [
			procs.procA('A'),
			procs.procB('B')
		];
		for (var x = 0, m = Math.random() * 3 + 2; x < m; ++x) {
			promises.push(procs.procX('X' + x));
		}

		try {
			var result = yield promises;
		} catch (err) {
			procs.error('err1*', err);
			throw err;
		}

		try {
			var val = yield procs.procC('C:' + result.join(','));
			procs.info('end* ', val);
		} catch (err) {
			procs.error('err2*', err);
			throw err;
		}

		return 'ok';
	}

	aa(main()).then(
		function (val) { procs.info('final', val); },
		function (err) { procs.error('final', err); });

})();
