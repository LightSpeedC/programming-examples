void function () {
	'use strict';

	function Klass1(name) {
		this.name = name;
		this.public1 = 'public1:' + name;
		this._notPrivate1 = 'notPrivate1:' + name;
		this._notPrivate2 = {notPrivate2: 'notPrivate2:' + name};
	}

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
	var c1 = new Class1('c1');
	console.log(c1._notPrivate1, c1._notPrivate2);

}();
