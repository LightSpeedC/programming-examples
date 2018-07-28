console.log(this);
function *g() {
	yield 1;
	yield 2;
	yield 3;
	return 10;
}
var gg = g();
console.log(typeof g, g.constructor.name);
console.log(typeof gg, gg.constructor.name);
console.dir(gg.constructor.prototype);
console.dir(gg);
console.dir(gg.next());
console.dir(gg.next());
console.dir(gg.next());
console.dir(gg.next());
