var assert = require('assert');
//var assert = require('chai').assert;

describe('Array', function () {
	describe('#indexOf()', function () {
		it('should return -1 when the value is not presnet', function () {
			assert.equal(-1, [1, 2, 3].indexOf(5));
			assert.equal(-1, [1, 2, 3].indexOf(0));
		});
	});
});
