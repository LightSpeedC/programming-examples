// $ iojs --harmony-classes es6c.js

(function () {
	'use strict';

	console.info('es6c.js');

	class Base {
		constructor(name) {
			this.name = name;
		}
		morning() {
			return 'good morning, ' + this.name;
		}
		evening() {
			return 'good evening, ' + this.name;
		}
		static baseMethod() {
			return 'baseMethod';
		}
	}

	class Japan extends Base {
		morning() {
			return this.name + '-san, ohayou';
		}
	}

	class Osaka extends Japan {}

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
	if (!{}.__proto__) console.warn('warn: {}.__proto__ is undefined');
	assert(Osaka.__proto__ === Japan,  'err: Osaka.__proto__ === Japan');
	assert(Japan.__proto__ === Base,   'err: Japan.__proto__ === Base');
	assert(Base.__proto__ === Function.prototype, 'err: Base.__proto__ === Function.prototype');
	Base.newBaseMethod = function () {};
	assert(Base.newBaseMethod  !== undefined, 'err: Base.newBaseMethod  !== undefined');
	assert(Japan.newBaseMethod !== undefined, 'err: Japan.newBaseMethod !== undefined');
	assert(Osaka.newBaseMethod !== undefined, 'err: Osaka.newBaseMethod !== undefined');
	function assert(flag, msg) { if (!flag) console.error(msg); }

})();
