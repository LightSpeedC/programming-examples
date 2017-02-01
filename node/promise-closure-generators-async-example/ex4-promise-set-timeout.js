console.log('AAA');

Promise.resolve(999)
	.then(data => console.log(data));

new Promise(resolve => resolve(111))
	.then(data => console.log(data));

new Promise(resolve => setTimeout(resolve, 2000, 222))
	.then(data => console.log(data));

console.log('BBB');
