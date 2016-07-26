var assert = require('assert');
//var assert = require('chai').assert;

function User(name) {
	this.name = name;
}
User.prototype.save = function (cb) {
	setTimeout(function () { cb(); }, 1);
};

describe('User', function () {
	describe('#save()', function () {
		it('should save without error', function (done) {
			var user = new User('Luna');
			user.save(function (err) {
				if (err) throw err;
				done();
			});
		});
	});
});

describe('User2', function () {
	describe('#save2()', function () {
		it('should save without error', function (done) {
			var user = new User('Luna');
			user.save(done);
		});
	});
});
