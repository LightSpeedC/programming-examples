// promise

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
//	var Promise = require('promise-light');
	var Promise = require('promise-thunk');

	function main() {
		var promises = [
			procs.procA('A'),
			procs.procB('B')
		];
		for (var x = 0, m = Math.random() * 3 + 2; x < m; ++x) {
			promises.push(procs.procX('X' + x));
		}

		Promise.all(promises).then(function (result) {
			return procs.procC('C:' + result.join(','));
		},
		function (err) {
			procs.error('err1*', err);
			return Promise.reject(err); // !!! chain error!
		}).then(function (val) {
			procs.info('end* ', val);
		},
		function (err) {
			procs.error('err2*', err);
		});

	}

	main();

})();
