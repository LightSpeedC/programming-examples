// transform-xor.js

void function () {
	'use strict';

	var Transform = require('stream').Transform;

	require('util').inherits(TransformXor, Transform);

	function TransformXor(xorCode) {
		this._xorCode = xorCode || 0xCD;
		Transform.apply(this, arguments);
	}

	TransformXor.prototype._transform = function (chunk, encoding, cb) {
		var xorCode = this._xorCode;

		for (var i = 0; i < chunk.length; ++i)
			chunk[i] ^= xorCode;

		this.push(chunk);
		process.nextTick(cb);
	};

	module.exports = TransformXor;

}();
