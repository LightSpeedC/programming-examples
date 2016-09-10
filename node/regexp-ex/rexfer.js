void function () {
	'use strict';

	module.exports = Rexfer;

	var DOT = new RegExp('\\.', 'g');
	var ASTER = new RegExp('\\*', 'g');
	var QUES = new RegExp('\\?', 'g');

	// class Rexfer
	function Rexfer(pattern, opts) {
		if (typeof pattern !== 'string')
			throw new Error('argument "pattern" must be string');

		this.test = null;
		this.list = [];
		this.rex = null;
		this.pattern = pattern;

		var list = pattern.split(';');
		if (list.length > 1)
			return this.list = list.map(x => new Rexfer(x, opts)),
				this.test = this.testOr, this;

		list = pattern.split(' ');
		if (list.length > 1)
			return this.list = list.map(x => new Rexfer(x, opts)),
				this.test = this.testAnd, this;

		list = pattern.split(',');
		if (list.length > 1)
			return this.list = list.map(x => new Rexfer(x, opts)),
				this.test = this.testOr, this;

		if (pattern.startsWith('-')) {
			this.test = this.testNot;
			this.rex = new RegExp(pattern.substr(1)
				.replace(DOT, '\\.')
				.replace(ASTER, '.*')
				.replace(QUES, '.'), opts);
			return this;
		}

		//this.test = this.testString;
		//this.rex = new RegExp(pattern.replace(DOT, '\\.').replace(ASTER, '.*'));
		return new RegExp(pattern
			.replace(DOT, '\\.')
			.replace(ASTER, '.*')
			.replace(QUES, '.'), opts);
	}
	//// Rexfer#testString
	//Rexfer.prototype.testString = function testString(string) {
	//	return this.rex.test(string);
	//};
	// Rexfer#testOr
	Rexfer.prototype.testOr = function testOr(string) {
		return this.list.some(x => x.test(string));
	};
	// Rexfer#testAnd
	Rexfer.prototype.testAnd = function testAnd(string) {
		return this.list.every(x => x.test(string));
	};
	// Rexfer#testNot
	Rexfer.prototype.testNot = function testNot(string) {
		return !this.rex.test(string);
	};

} ();
