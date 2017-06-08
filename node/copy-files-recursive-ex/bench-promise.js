function benchPromise() {
	'use strict';

	(typeof commonMethods === 'function' ? commonMethods : require('./common-methods'))(Dummy);
	(typeof commonAa === 'function' ? commonAa : require('./common-aa'))(Dummy);

	function Dummy(setup) {
		return new Promise(setup);
	}

	(typeof commonBench === 'function' ? commonBench : require('./common-bench'))(Dummy)
		.bench('Promise');
}

benchPromise();
// if (typeof module === 'object' && module && module.exports)
// 	module.exports = benchPromise;
