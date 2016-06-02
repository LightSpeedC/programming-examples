void function () {
	'use strict';

	module.exports = MyWeakMap;

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
	MyWeakMap.prototype['delete'] = function _delete(key) {
		var i = this._keys.indexOf(key);
		if (i < 0) return false;
		this._keys.splice(i, 1);
		this._values.splice(i, 1);
		return true;
	};

	return MyWeakMap;
}();
