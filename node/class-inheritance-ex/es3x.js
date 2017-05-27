// $ node es3x.js

(function () {
	'use strict';

	console.info('es3x.js');

	// $ npm install base-class-extend
	// var extend = require('base-class-extend').extend;

	var getProto = Object.getPrototypeOf || {}.__proto__ ?
		function getProto(obj) { return obj.__proto__; } : null;

	var setProto = Object.setPrototypeOf || {}.__proto__ ?
		function setProto(obj, proto) { obj.__proto__ = proto; } : null;

	var extend = setProto ?
		function extend(proto, props) {
			'use strict';
			proto = proto || {};
			var _super = typeof this === 'function' ? this : Object;
			var ctor = proto.hasOwnProperty('constructor') ? proto.constructor :
				function () { _super.apply(this, arguments); };
			ctor.prototype = proto;
			setProto(proto, _super.prototype);
			if (!proto.hasOwnProperty('constructor'))
				Object.defineProperty(proto, 'constructor',
					{value: ctor, writable: true, configurable: true});
			if (_super !== Object) setProto(ctor, _super);
			if (props)
				for (var p in props) if (props.hasOwnProperty(p)) // ctor[p] = props[p];
					Object.defineProperty(ctor, p, Object.getOwnPropertyDescriptor(props, p));
			if (!('extend' in ctor)) ctor.extend = extend;
			ctor.super_ = _super;
			return ctor;
		} :
		function extend(proto, props) {
			'use strict';
			proto = proto || {};
			var _super = typeof this === 'function' ? this : Object;
			var ctor = proto.hasOwnProperty('constructor') ? proto.constructor :
				function () { _super.apply(this, arguments); };
			function __() { this.constructor = ctor; }
			__.prototype = _super.prototype;
			ctor.prototype = new __();
			for (var p in proto) if (proto.hasOwnProperty(p)) ctor.prototype[p] = proto[p];
			for (var p in _super) if (_super.hasOwnProperty(p)) ctor[p] = _super[p];
			if (props)
				for (var p in props) if (props.hasOwnProperty(p)) ctor[p] = props[p];
			if (!('extend' in ctor)) ctor.extend = extend;
			ctor.super_ = _super;
			if (ctor.__proto__) ctor.__proto__ = _super;
			return ctor;
		};

	var Base = extend({
		constructor: function Base(name) {
			this.name = name;
		},
		morning: function morning() {
			return 'good morning, ' + this.name;
		},
		evening: function evening() {
			return 'good evening, ' + this.name;
		}
	},
	{
		baseMethod: function baseMethod() {
			return 'baseMethod';
		}
	});

	var Japan = Base.extend({
		morning: function morning() {
			return this.name + '-san, ohayou';
		}
	});

	var Osaka = Japan.extend();

	var tanaka = new Japan('tanaka');
	console.log(tanaka.morning()); // => tanaka-san, ohayou
	console.log(tanaka.evening()); // => good evening, tanaka
	var yamada = new Osaka('yamada');

	assert(tanaka.morning() === 'tanaka-san, ohayou', 'err: tanaka-san, ohayou');
	assert(tanaka.evening() === 'good evening, tanaka', 'err: good evening, tanaka')
	assert(tanaka instanceof Japan,  'err: tanaka instanceof Japan');
	assert(tanaka instanceof Base,   'err: tanaka instanceof Base');
	assert(tanaka instanceof Object, 'err: tanaka instanceof Object');
	assert(yamada.morning() === 'yamada-san, ohayou',   'err: yamada-san, ohayou');
	assert(yamada.evening() === 'good evening, yamada', 'err: good evening, yamada')
	assert(yamada instanceof Osaka,  'err: yamada instanceof Osaka');
	assert(yamada instanceof Japan,  'err: yamada instanceof Japan');
	assert(yamada instanceof Base,   'err: yamada instanceof Base');
	assert(yamada instanceof Object, 'err: yamada instanceof Object');
	assert((Base.baseMethod  && Base.baseMethod())  === 'baseMethod', 'err: Base.baseMethod()');
	assert((Japan.baseMethod && Japan.baseMethod()) === 'baseMethod', 'err: Japan.baseMethod()');
	assert((Osaka.baseMethod && Osaka.baseMethod()) === 'baseMethod', 'err: Osaka.baseMethod()');
	assert((new Base).constructor === Base, 'err: (new Base).constructor === Base');
	assert(tanaka.constructor === Japan,    'err: tanaka.constructor === Japan');
	assert(yamada.constructor === Osaka,    'err: yamada.constructor === Osaka');
	assert(Osaka.super_ === Japan,  'err: Osaka.super_ === Japan');
	assert(Japan.super_ === Base,   'err: Japan.super_ === Base');
	if (!{}.__proto__) console.warn('warn: {}.__proto__ is undefined');
	if (Osaka.__proto__)
	assert(Osaka.__proto__ === Japan,  'err: Osaka.__proto__ === Japan');
	if (Japan.__proto__)
	assert(Japan.__proto__ === Base,   'err: Japan.__proto__ === Base');
	if (Base.__proto__)
	assert(Base.__proto__ === Function.prototype, 'err: Base.__proto__ === Function.prototype');
	Base.newBaseMethod = function () {};
	assert(Base.newBaseMethod  !== undefined, 'err: Base.newBaseMethod  !== undefined');
	assert(Japan.newBaseMethod !== undefined, 'err: Japan.newBaseMethod !== undefined');
	assert(Osaka.newBaseMethod !== undefined, 'err: Osaka.newBaseMethod !== undefined');
	function assert(flag, msg) { if (!flag) console.error(msg); }

})();
