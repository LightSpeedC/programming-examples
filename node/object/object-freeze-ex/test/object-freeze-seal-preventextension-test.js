// original: http://unageanu.hatenablog.com/entry/20110918/1316320274

var assert = require('assert');

var test = function () {
	//'use strict';
	// strict モードにすると、Firefox,Google Chrome,Safariでは
	// frozenObjectへの属性の追加等でもTypeErrorが発生するようになる。
	// IEでは、非strict モードと変わらない動作をする。

	var isStrictMode = function () { return this; } () === undefined;
	console.log('isStrictMode:', isStrictMode);

	describe('Frozen Object ' + (isStrictMode ? 'Strict' : ''), function () {

		var frozenObject;

		beforeEach(function () {
			frozenObject = createObject();
			Object.freeze(frozenObject);
		});

		it('should be fail to add property.', function () {
			try {
				frozenObject.x = 'xxx';
				assert(frozenObject.x === undefined);
				assert(!isStrictMode, 'isStrictMode !== true ?');
			} catch (e) {
				//console.log(e.name, e + '');
				assert(e.name === 'TypeError', e + '');
				assert(isStrictMode, 'isStrictMode === true ?');
			}
		});

		it('should be fail to delete property.', function () {
			try {
				delete frozenObject.a;
				assert(frozenObject.a === 'aaa');
				assert(!isStrictMode, 'isStrictMode !== true ?');
			} catch (e) {
				//console.log(e.name, e + '');
				assert(e.name === 'TypeError', e + '');
				assert(isStrictMode, 'isStrictMode === true ?');
			}
		});

		it('should be fail to modify property.', function () {
			try {
				frozenObject.a = 'xxx' ;
				assert(frozenObject.a === 'aaa');
				assert(!isStrictMode, 'isStrictMode !== true ?');
			} catch (e) {
				//console.log(e.name, e + '');
				assert(e.name === 'TypeError', e + '');
				assert(isStrictMode, 'isStrictMode === true ?');
			}
		});

		it('should be fail to configure property.', function () {
			try {
				Object.defineProperty(frozenObject, 'a', {
					enumerable: false
				});
			} catch (e) {
				return;
			}
			assert(false);
		});

	});

	describe('Sealed Object ' + (isStrictMode ? 'Strict' : ''), function () {

		var sealedObject;

		beforeEach(function () {
			sealedObject = createObject();
			Object.seal(sealedObject);
		});

		it('should be fail to add property.', function () {
			try {
				sealedObject.x = 'xxx';
				assert(sealedObject.x === undefined);
				assert(!isStrictMode, 'isStrictMode !== true ?');
			} catch (e) {
				//console.log(e.name, e + '');
				assert(e.name === 'TypeError', e + '');
				assert(isStrictMode, 'isStrictMode === true ?');
			}
		});

		it('should be fail to delete property.', function () {
			try {
				delete sealedObject.a;
				assert(sealedObject.a === 'aaa');
				assert(!isStrictMode, 'isStrictMode !== true ?');
			} catch (e) {
				//console.log(e.name, e + '');
				assert(e.name === 'TypeError', e + '');
				assert(isStrictMode, 'isStrictMode === true ?');
			}
		});

		it('should be success to modify property.', function () {
			sealedObject.a = 'xxx' ;
			assert(sealedObject.a === 'xxx');
		});

		it('should be fail to configure property.', function () {
			try {
				Object.defineProperty(sealedObject, 'a', {
					enumerable: false
				});
			} catch (e) {
				return;
			}
			assert(false);
		});

	});

	describe('Non Extensible Object ' + (isStrictMode ? 'Strict' : ''), function () {

		var nonExtensibleObject

		beforeEach(function () {
			nonExtensibleObject = createObject();
			Object.preventExtensions(nonExtensibleObject);
		});

		it('should be fail to add property.', function () {
			try {
				nonExtensibleObject.x = 'xxx';
				assert(nonExtensibleObject.x === undefined);
				assert(!isStrictMode, 'isStrictMode !== true ?');
			} catch (e) {
				//console.log(e.name, e + '');
				assert(e.name === 'TypeError', e + '');
				assert(isStrictMode, 'isStrictMode === true ?');
			}
		});

		it('should be success to delete property.', function () {
			delete nonExtensibleObject.a;
			assert(nonExtensibleObject.a === undefined);
		});

		it('should be success to modify property.', function () {
			nonExtensibleObject.a = 'xxx' ;
			assert(nonExtensibleObject.a === 'xxx');
		});

		it('should be success to configure property.', function () {
			Object.defineProperty(nonExtensibleObject, 'a', {
				enumerable: false
			});
		});

	});

	// utils
	function createObject() {
		return {a: 'aaa'};
	}

} // test

	var a = (test + '').split('\n');
	a.splice(0, 2);
	a.pop();
	eval(a.join('\n'));

	a = (test + '').split('\n')
	a.splice(0, 2, "'use strict';");
	a.pop();
	eval(a.join('\n'));
