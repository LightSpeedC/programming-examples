void function (WeakMap) {
	'use strict';

	var extend = require('./extend-light');

	const private1 = new WeakMap();
	const private2 = new WeakMap();

	function Klass1(name) {
		this.name = name;
		this.public1 = 'public1:' + name;
		private1.set(this, 'private1:' + name);
		private2.set(this, {private2: 'private2:' + name});
	}

	Object.defineProperty(Klass1.prototype, 'private1', {
		get: function () { return private1.get(this); }});
	Klass1.prototype.getPrivate1 =
		function () { return private1.get(this); };
	Object.defineProperty(Klass1.prototype, 'private2', {
		get: function () { return private2.get(this); }});
	Klass1.prototype.getPrivate2 =
		function () { return private2.get(this); };
	Klass1.prototype.free = function () { private1.delete(this); private2.delete(this); }

	var Klass2 = extend('Klass2', {
		constructor: function Klass2(name) {
			this.name = name;
			this.public1 = 'public1:' + name;
			private1.set(this, 'private1:' + name);
			private2.set(this, {private2: 'private2:' + name});
		},
		get private1() { return private1.get(this); },
		getPrivate1: function getPrivate1() { return private1.get(this); },
		get private2() { return private2.get(this); },
		getPrivate2: function getPrivate2() { return private2.get(this); },
		free: function free() { private1.delete(this); private2.delete(this); }
	});

	const Klass3 = extend('Klass3', {
		constructor: function Klass3(name) {
			this.name = name;
			this.public1 = 'public1:' + name;
			private1.set(this, 'private1:' + name);
			private2.set(this, {private2: 'private2:' + name});
		},
		get private1() { return private1.get(this); },
		getPrivate1()  { return private1.get(this); },
		get private2() { return private2.get(this); },
		getPrivate2()  { return private2.get(this); },
		free() { private1.delete(this); private2.delete(this); }
	});

	class Class1 {
		constructor(name) {
			this.name = name;
			this.public1 = 'public1:' + name;
			private1.set(this, 'private1:' + name);
			private2.set(this, {private2: 'private2:' + name});
		}
		get private1() { return private1.get(this); }
		getPrivate1()  { return private1.get(this); }
		get private2() { return private2.get(this); }
		getPrivate2()  { return private2.get(this); }
		free() { private1.delete(this); private2.delete(this); }
	}

	var k1 = new Klass1('k1');
	console.log(k1.private1, k1.getPrivate1());
	console.log(k1.private2, k1.getPrivate2());
	k1.free();
	var k2 = new Klass1('k2');
	console.log(k2.private1, k2.getPrivate1());
	console.log(k2.private2, k2.getPrivate2());
	var k3 = new Klass1('k3');
	console.log(k3.private1, k3.getPrivate1());
	console.log(k3.private2, k3.getPrivate2());
	k2.free();
	var c1 = new Class1('c1');
	console.log(c1.private1, c1.getPrivate1());
	console.log(c1.private2, c1.getPrivate2());
	c1.free();

}(typeof WeakMap === 'function' ? WeakMap : require('./my-weakmap'));
