function benchThunk() {
	'use strict';

	var Thunk2 = typeof Thunk === 'function' ? Thunk : require('./thunk');
	Thunk2.aa = typeof aa === 'function' ? aa : require('./aa');
	Thunk2.bench = typeof bench === 'function' ? bench : require('./bench');

	Thunk2.bench('Thunk');
}

benchThunk();

if (typeof module === 'object' && module && module.exports)
	module.exports = benchThunk;
