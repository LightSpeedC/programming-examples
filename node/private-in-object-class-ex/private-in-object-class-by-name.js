void function () {
	'use strict';

	var extend = require('./extend-light');

	function Klass1(name) {
		this.name = name;
		this.public1 = 'public1:' + name;
		this._notPrivate1 = 'notPrivate1:' + name;
		this._notPrivate2 = {notPrivate2: 'notPrivate2:' + name};
	}

	var Klass2 = extend('Klass2', {
		constructor: function Klass2(name) {
			this.name = name;
			this.public1 = 'public1:' + name;
			this._notPrivate1 = 'notPrivate1:' + name;
			this._notPrivate2 = {notPrivate2: 'notPrivate2:' + name};
		}
	});

	class Class1 {
		constructor(name) {
			this.name = name;
			this.public1 = 'public1:' + name;
			this._notPrivate1 = 'notPrivate1:' + name;
			this._notPrivate2 = {notPrivate2: 'notPrivate2:' + name};
		}
	}

	var k1 = new Klass1('k1');
	console.log(k1._notPrivate1, k1._notPrivate2);
	var k2 = new Klass1('k2');
	console.log(k2._notPrivate1, k2._notPrivate2);
	var c1 = new Class1('c1');
	console.log(c1._notPrivate1, c1._notPrivate2);

}();
