var MyWeakMap = function () {
	'use strict';

	function MyWeakMap() {
		this._keys = [];
		this._values = [];
	}

	// has
	MyWeakMap.prototype.has = function has() {
		return this._keys.indexOf(key) >= 0;
	};

	// get
	MyWeakMap.prototype.get = function get(key) {
		var i = this._keys.indexOf(key);
		if (i < 0) return void 0;
		return this._values[i];
	};

	// set
	MyWeakMap.prototype.set = function set(key, value) {
		if (typeof key !== 'object' && typeof key !== 'function' || key === null)
			throw new TypeError('Invalid value used as weak map key');
		var i = this._keys.indexOf(key);
		if (i < 0) i = this._keys.length;
		this._keys[i] = key;
		this._values[i] = value;
	};

	// delete
	MyWeakMap.prototype['delete'] = function _delete() {
		var i = this._keys.indexOf(key);
		if (i < 0) return false;
		this._keys.splice(i, 1);
		this._values.splice(i, 1);
		return true;
	};

	return MyWeakMap;
}();

void function (WeakMap) {
	'use strict';

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
	var c1 = new Class1('c1');
	console.log(c1.private1, c1.getPrivate1());
	console.log(c1.private2, c1.getPrivate2());
	c1.free();

}(typeof WeakMap === 'function' ? WeakMap : MyWeakMap);
