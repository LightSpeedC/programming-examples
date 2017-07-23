function f() {}
function *gf() {}
const g = gf();
x('f', f);
x('gf', gf);
x('g', g);

function x(nm, f) {
	console.log('\n***', pad(typeof f, 8), pad(nm, 4),
		'ctor:', pad(typeof f.constructor, 8), pad(f.constructor.name, 18),
		'name:', pad(f.name, 20));
	console.log('props: ' + Object.getOwnPropertyNames(f));
	f.prototype &&
	console.log('proto: ' + Object.getOwnPropertyNames(f.prototype));
	console.log('ctor.props: ' + Object.getOwnPropertyNames(f.constructor));
	console.log('ctor.proto: ' + Object.getOwnPropertyNames(f.constructor.prototype));
}

function pad(s, n) {
	return (s + '                                              ').substr(0, n);
}
