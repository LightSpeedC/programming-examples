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

	var lib = require('./lib').lib;
	var aa = require('aa');
	var Promise = require('aa').Promise;

	for (var p in lib)
		if (p.substr(0, 4) === 'proc' &&
				typeof lib[p] === 'function')
			lib[p] = aa(lib[p]);

	main();

	function main() {
		lib.log('start**', '');

		var promises = [
			lib.procA('A'),
			lib.procB('B')
		];
		for (var x = 0, m = Math.random() * 3 + 2; x < m; ++x) {
			promises.push(lib.procX('X' + x));
		}

		Promise.all(promises)
		.then(
			function (result) {
				return lib.procC('C:' + result.join(','));
			},
			function (err) {
				lib.error('err1*', err);
				return Promise.reject(err); // !!! chain error!
			})
		.then(
			function (val) { lib.info('end* ', val); },
			function (err) { lib.error('err2*', err); })
		.then(
			function () { lib.log('final**', ''); });

	}

})();
