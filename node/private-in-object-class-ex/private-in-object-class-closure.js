void function () {
	'use strict';

	var extend = require('./extend-light');

	function Klass1(name) {
		this.name = name;
		this.public1 = 'public1:' + name;

		var private1 = 'private1:' + name;
		this.getPrivate1 = () => private1;
		Object.defineProperty(this, 'private1',
			{get: function () { return private1; }});

		var private2 = {private2: 'private2:' + name};
		this.getPrivate2 = () => private2;
		Object.defineProperty(this, 'private2',
			{get: function () { return private2; }});
	}

	var Klass2 = extend('Klass2', {
		constructor: function Klass2(name) {
			this.name = name;
			this.public1 = 'public1:' + name;
			private1.set(this, 'private1:' + name);
			private2.set(this, {private2: 'private2:' + name});

			var private1 = 'private1:' + name;
			var private2 = {private2: 'private2:' + name};

			this.privates({
				getPrivate1: () => private1,
				getPrivate2: () => private2,
				get private1() { return private1; },
				get private2() { return private2; }
			});
		}
	});

	class Class1 {
		constructor(name) {
			this.name = name;
			this.public1 = 'public1:' + name;

			let private1 = 'private1:' + name;
			this.getPrivate1 = () => private1;
			Object.defineProperty(this, 'private1',
				{get: () => private1});

			let private2 = {private2: 'private2:' + name};
			this.getPrivate2 = () => private2;
			Object.defineProperty(this, 'private2',
				{get: () => private2});
		}
	}

	var k1 = new Klass1('k1');
	console.log(k1.private1, k1.getPrivate1());
	console.log(k1.private2, k1.getPrivate2());
	var k2 = new Klass1('k2');
	console.log(k2.private1, k2.getPrivate1());
	console.log(k2.private2, k2.getPrivate2());
	var c1 = new Class1('c1');
	console.log(c1.private1, c1.getPrivate1());
	console.log(c1.private2, c1.getPrivate2());

}();
