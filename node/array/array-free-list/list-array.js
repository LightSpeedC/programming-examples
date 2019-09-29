// list-array

void function () {
	'use strict';

	module.exports = ListArray;

	// Object.freeze
	if (!Object.freeze) Object.freeze = function freeze(x) { return x; };

	// EMPTY
	const EMPTY = ListArray.EMPTY = new function Empty(){ Object.freeze(this); };

	// ListArray
	function ListArray() {
		this._used = [];
		this._free = [];
		Object.freeze(this);
	}

	// get
	ListArray.prototype.get = function get(idx) {
		return this._used[idx];
	};

	// set
	ListArray.prototype.set = function set(idx, val) {
		if (this._used[idx] !== EMPTY && val === EMPTY)
			this._free.push(idx);
		else if (this._used[idx] === EMPTY && val !== EMPTY)
			throw new Error('not yet implemented!');
		return this._used[idx] = val;
	};

	// push
	ListArray.prototype.push = function push(val) {
		if (val === EMPTY)
			throw new RangeError('undefined can not push!');

		if (this._free.length > 0) {
			var idx = this._free.pop();
			this._used[idx] = val;
		}
		else {
			var idx = this._used.length;
			this._used.push(val);
		}
		return idx;
	};

	// clear
	ListArray.prototype.clear = function clear(idx) {
		if (this._used[idx] === EMPTY)
			throw new RangeError('already cleared!');

		this._used[idx] = EMPTY;
		this._free.push(idx);
	};

	// getUsed
	ListArray.prototype.getUsed = function getUsed() {
		return this._used;
	};

	// getFree
	ListArray.prototype.getFree = function getFree() {
		return this._free;
	};

	Object.freeze(ListArray);
	Object.freeze(ListArray.prototype);

}();
