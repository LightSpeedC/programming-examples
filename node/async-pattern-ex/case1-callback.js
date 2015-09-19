// callback

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

	main();

	function main() {
		var n = 0, result = [];

		n++; procs.procA('A', callbackABX);
		n++; procs.procB('B', callbackABX);
		for (var x = 0, m = Math.random() * 3 + 2; x < m; ++x) {
			n++; procs.procX('X' + x, callbackABX);
		}

		function callbackABX(err, val) {
			if (err) procs.error('err1*', err), n = 0;
			result.push(val);
			if (--n === 0)
				procs.procC('C:' + result.join(','), callbackC);
		}

		function callbackC(err, val) {
			if (err) procs.error('err2*', err);
			procs.info('end* ', val);
		}
	}

})();
