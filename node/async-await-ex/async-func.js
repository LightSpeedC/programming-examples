if (this === undefined) require('babel/polyfill');

async function dox(num) {
	console.log(num);
	if (num > 0) {
		return await dox(--num);
	}
	return num;
}

dox(10);
console.log("hello");
