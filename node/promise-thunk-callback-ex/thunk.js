var Thunk = function (Thunk, resolve, reject, wait, all, aa) {
	'use strict';

	var slice = [].slice;

	Thunk.resolve = Thunk.resolve || resolve;
	Thunk.reject = Thunk.reject || reject;
	Thunk.wait = Thunk.wait || wait;
	Thunk.all = Thunk.all || all;
	Thunk.aa = Thunk.aa || aa;

	return Thunk;

}(typeof Thunk === 'function' ? Thunke :
	typeof ThunkCore === 'function' ? ThunkCore : require('./thunk-core'),
	typeof resolve === 'function' ? resolve : require('./resolve'),
	typeof reject === 'function' ? reject : require('./reject'),
	typeof wait === 'function' ? wait : require('./wait'),
	typeof all === 'function' ? all : require('./all'),
	typeof aa === 'function' ? aa : require('./aa'));

if (typeof module === 'object' && module && module.exports)
	module.exports = Thunk;
