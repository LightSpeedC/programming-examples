// proto-vs-constructor-prototype.js

var a = [];
console.log(a.__proto__ === a.constructor.prototype); // -> true
console.log(a.__proto__.__proto__ ===
	a.constructor.prototype.constructor.prototype); // -> false

var o = {};
console.log(o.__proto__ === o.constructor.prototype); // -> true
console.log(o.__proto__.__proto__ ===
	o.constructor.prototype.constructor.prototype); // -> false
