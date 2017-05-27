this.extend = function () {
	'use strict';

	function merge(dst, src) {
		for (var i = 1; src = arguments[i], i < arguments.length; ++i)
			for (var p in src)
				if (src.hasOwnProperty(p) && !dst.hasOwnProperty(p) &&
						dst[p] !== src[p]) dst[p] = src[p];
		return dst;
	}

	function extend(props, statics) {
		'use strict';
		props = props || {};
		var _super = typeof this === 'function' ? this : undefined;

		var ctor = props.hasOwnProperty('constructor') ? props.constructor :
			_super ? function () { _super.apply(this, arguments); } : function () {};

		function __() { this.constructor = ctor; }
		if (_super) __.prototype = _super.prototype;
		ctor.prototype = merge(new __(), props);

		if (_super && ctor.__proto__) ctor.__proto__ = _super;
		return merge(ctor, props.statics, statics,
			_super ? {super_: _super} : undefined, _super, {extend: extend});
	}

	if (typeof module === 'object' && module && module.exports)
		module.exports = extend;

	return extend;
}();
