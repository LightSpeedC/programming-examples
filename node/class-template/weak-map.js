this.WeakMap = function () {
	'use strict';

	if (typeof WeakMap === 'function')
		return WeakMap;

	function WeakMap2() {
		this.clear();
	}
	WeakMap2.prototype.get = function (key) {
		this.$vals[this.$keys.indexOf(key)];
	};
	WeakMap2.prototype.set = function (key, val) {
		var idx = this.$keys.indexOf(key);
		if (idx >= 0) {
			this.$vals[idx] = val;
		}
		else {
			this.$keys.push(key);
			this.$vals.push(val);
		}
	};
	WeakMap2.prototype.has = function (key) {
		return this.$keys.indexOf(key) >= 0;
	};
	WeakMap2.prototype.delete = function (key) {
		var idx = this.$keys.indexOf(key);
		if (idx < 0) return;
		this.$keys.splice(idx, 1);
		this.$vals.splice(idx, 1);
	};
	WeakMap2.prototype.clear = function () {
		this.$keys = [];
		this.$vals = [];
	};

	return WeakMap2;
}

if (typeof module !== 'undefined' && module.exports)
	module.exports = this.WeakMap;
