function *gtor() {
	for (var i = 0; i < 5; ++i)
		yield i;
	return 999;
}

var g = gtor();
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());
