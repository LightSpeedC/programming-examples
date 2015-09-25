(function (global) {
	var aa = global.aa || require('aa');
	function *g() {
		yield 1;
		yield 2;
		yield 3;
		return 10;
	}
	var gg = g();
	console.log(typeof g, g.constructor.name);
	console.log(typeof gg, gg.constructor.name);
	console.log(gg.__proto__.constructor.name);
	console.log(gg.__proto__.__proto__.constructor.name);
	console.log(gg.__proto__.__proto__.__proto__.constructor.name);
	console.log(gg);
	console.log(gg.next());
	console.log(gg.next());
	console.log(gg.next());
	console.log(gg.next());
})(typeof global === 'object' ? global :
   typeof window === 'object' ? window :
   typeof self   === 'object' ? self : this);
