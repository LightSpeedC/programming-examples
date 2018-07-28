// function makeCounter(x) {
// 	return function() {
// 		return x++;
// 	}
// }

const makeCounter = x => () => x++;

const c10 = makeCounter(10);
const c20 = makeCounter(20);
console.log(c10());
console.log(c10());
console.log(c10());
console.log(c20());
console.log(c20());
console.log(c20());

class Counter {
	constructor(x) {
		this.x = x;
	}
	get count() {
		return this.x++;
	}
}
const c1 = new Counter(1);
console.log(c1.count);
console.log(c1.count);
console.log(c1.count);
