'use strict';

//console.log('Promise:', Object.getOwnPropertyNames(Promise));
//console.log('proto:', Object.getOwnPropertyNames(Promise.prototype));

var LazyPromise = require('./lazy-promise');

new LazyPromise(function (res, rej) { res(1); }).then(
	val => console.log(val),
	err => console.error(err));
LazyPromise.resolve(2).then(
	val => console.log(val),
	err => console.error(err));
