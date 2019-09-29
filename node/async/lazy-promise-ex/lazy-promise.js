(this || {}).LazyPromise = function () {
	'use strict';

	//var extend = require('./extend-light');

	var setProto = Object.setPrototypeOf ||
			function setProto(obj, proto) { obj.__proto__ = proto; };

	var LazyPromise = extend(Promise, {
		constructor: function LazyPromise(setup) {
			// Promise.call(this, function () {}); -- cause error
			this._setup = setup;
			this._promise = null;
		},
		then: function then() {
			if (!this._promise)
				this._promise = new Promise(this._setup);
			return this._promise.then.apply(this._promise, arguments);
		},
		'catch': function caught() {
			if (!this._promise)
				this._promise = new Promise(this._setup);
			return this._promise['catch'].apply(this._promise, arguments);
		},
		chain: function chain() {
			if (!this._promise)
				this._promise = new Promise(this._setup);
			return this._promise.chain.apply(this._promise, arguments);
		}
	},
	{
		all:     function all(a) {
			return Promise.all.apply(Promise, arguments); },
		race:    function race(a) {
			return Promise.race.apply(Promise, arguments); },
		resolve: function resolve(v) {
			return new LazyPromise(function (res, rej) { res(v); }); },
		reject:  function reject(e) {
			return new LazyPromise(function (res, rej) { rej(e); }); },
		defer:   function defer() {
			return Promise.defer.apply(Promise, arguments); },
		accept:  function accept(v) {
			return Promise.accept.apply(Promise, arguments); }
	});

	if (typeof module === 'object' && module && module.exports)
		module.exports = LazyPromise;

	return LazyPromise;

	// extend-light (reduced)
	function extend(super_, proto, statics) {
		var ctor = proto.constructor;
		setProto(ctor.prototype, super_.prototype);
		merge(ctor.prototype, proto);
		setProto(ctor, super_);
		return merge(ctor, statics, super_);
	}

	// merge-light
	function merge(dst, src) {
		for (var i = 1; src = arguments[i], i < arguments.length; ++i)
			for (var p in src)
				if (src.hasOwnProperty(p) && !dst.hasOwnProperty(p) &&
						dst[p] !== src[p]) dst[p] = src[p];
		return dst;
	}

} ();

/*
Promise: [
  'length',
  'name',
  'prototype',
* 'reject',
* 'all',
* 'race',
* 'resolve',
* 'defer',
* 'accept' ]
proto: [
  'constructor',
* 'then',
* 'catch',
  'chain' ]
*/
