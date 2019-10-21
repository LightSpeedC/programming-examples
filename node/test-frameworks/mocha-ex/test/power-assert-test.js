// mocha
// mocha -w

// mocha --require intelli-espower-loader

// mocha.opts

// mocha --reporter spec
// mocha --reporter list
// mocha --reporter json
// mocha --reporter json-stream
// mocha --reporter dot
// mocha --reporter tap
// mocha --reporter landing
// mocha -R nyan


// mocha -s 75
// mocha --slow 75
// this.slow(75);

// mocha -t 2000
// mocha --timeout 2000
// this.timeout(2000);

// mocha -g string
// mocha --grep string

const assert = require('assert');

// before(() => console.log('before'));
// after(() => console.log('after'));
// beforeEach(() => console.log('beforeEach'));
// afterEach(() => console.log('afterEach'));

it('it-t0', done => {
	ww(50).then(done);
});

describe('describe-t1', () => {
	it('it-t1', () => {
		return ww(50);
	});
});

describe('describe-t2', () => {
	it('it-t2', done => {
		ww(50)(done);
	});
});

describe('describe-t3', () => {
	it('it-t3', done => {
		ww(50).then(done);
	});
});

describe('describe-t4', () => {
	describe('describe-t4-t4', () => {
		describe('describe-t4-t4-t4', () => {
			it('it-t4', () => {
				return ww(50);
			});
		});
	});
});

describe('describe-t5', () => {
	it('it-t5', done => {
		assert.equal({a:1}, {a:2});
		setTimeout(done, 50);
	});
});

/* mocha --ui tdd
suite('suite', () => {
	test('test', () => {
		assert.equal({a:1}, {a:2});
	});
});
*/


describe('Number', () => {
	describe('calc', () => {
		it('add', () => {
			assert(4+8 == 12);
		});
		it('sub', () => {
			assert(4-8 == -4);
		});
		it('mul', () => {
			assert(16*2 == 32);
		});
		it('div', () => {
			assert(8/2 == 4);
		});
	});
});

describe('Array', () => {  
	describe('#indexOf()', () => {
		it('should return -1 when the value is not present', () => {
			var arr = [1, 2, 3];
			assert(arr.indexOf(3) == 2);
			assert(arr.indexOf(5) == -1);
			assert(arr.indexOf(0) == 0);
		});
	});
});
