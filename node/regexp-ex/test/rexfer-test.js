void function () {
	const assert = require('assert');
	const Rexfer = require('../rexfer');

	describe('rexfer-test', function () {

		it('testStringAster', function () {
			const rex = new Rexfer('*');
			console.log(rex);
			assert(rex.test('a'), 'a');
			assert(rex.test('A'), 'a');
			assert(rex.test('b'), 'b');
			assert(rex.test(''), 'none');
			return;
		});

		it('testStringNot', function () {
			const rex = new Rexfer('-a');
			console.log(rex);
			assert(!rex.test('a'), 'a');
			assert(rex.test('A'), 'a');
			assert(rex.test('b'), 'b');
			assert(rex.test(''), 'none');
			return;
		});

		it('testStringNot-i', function () {
			const rex = new Rexfer('-a', 'i');
			console.log(rex);
			assert(!rex.test('a'), 'a');
			assert(!rex.test('A'), 'a');
			assert(rex.test('b'), 'b');
			assert(rex.test(''), 'none');
			return;
		});

		it('testOr1', function () {
			const rex = new Rexfer('a;b');
			console.log(rex);
			assert(rex.test('a'), 'a');
			assert(!rex.test('A'), 'a');
			assert(rex.test('b'), 'b');
			assert(!rex.test('c'), 'c');
			return;
		});

		it('testOr2', function () {
			const rex = new Rexfer('a,b');
			console.log(rex);
			assert(rex.test('a'), 'a');
			assert(!rex.test('A'), 'a');
			assert(rex.test('b'), 'b');
			assert(!rex.test('c'), 'c');
			return;
		});

		it('testOr1i', function () {
			const rex = new Rexfer('a;b', 'i');
			console.log(rex);
			assert(rex.test('a'), 'a');
			assert(rex.test('A'), 'a');
			assert(rex.test('b'), 'b');
			assert(!rex.test('c'), 'c');
			return;
		});

		it('testOr2i', function () {
			const rex = new Rexfer('a,b', 'i');
			console.log(rex);
			assert(rex.test('a'), 'a');
			assert(rex.test('A'), 'a');
			assert(rex.test('b'), 'b');
			assert(!rex.test('c'), 'c');
			return;
		});

		it('testAnd', function () {
			const rex = new Rexfer('a b');
			console.log(rex);
			assert(rex.test('a-b'), 'a-b');
			assert(!rex.test('A-B'), 'a-b');
			assert(!rex.test('c-d'), 'c-d');
			return;
		});

	}); // describe

} (); // void
