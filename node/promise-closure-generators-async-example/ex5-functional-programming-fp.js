const mul2 = x => x * 2;
const add = (x, y) => x + y;
const mul = (x, y) => x * y;
const even = x => x % 2 === 0;
const odd = x => x % 2 === 1;

console.log(mul2(333));

console.log([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce(add));
console.log([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce(mul));
console.log([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(mul2));

console.log([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(even));
console.log([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(even).reduce(add));

const list = [
	{ name: 'Kaz', age: 52 },
	{ name: 'Leo', age: 8 }
];

const getAge = x => x.age;
console.log(list.map(getAge).reduce(add));

console.log(list.map(x => x.age).reduce(add));
