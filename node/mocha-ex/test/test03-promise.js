var assert = require('assert');
//var assert = require('chai').assert;

function p1() {
	return new Promise(function (res, rej) {
		setTimeout(function () { res(); }, 1);
	});
}
function p3() {
	return new Promise(function (res, rej) {
		setTimeout(function () { res(['tobi', 'loki', 'jane']); }, 1);
	});
}
var db = {clear: p1, save: p1, find: p3};

beforeEach(function() {
	return db.clear()
		.then(function() {
			return db.save(['tobi', 'loki', 'jane']);
		});
});

describe('db', function() {
	describe('#find()', function() {
		it('respond with matching records', function() {
			return new Promise(function (res, rej) {
				db.find({type: 'User'}).then(
					function (val) { if (val.length === 3) res(); else rej(new Error('eh!?')); },
					rej);
			});
		});
	});
});
