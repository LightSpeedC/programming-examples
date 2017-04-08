const wait = (msec, val) => new Promise(resolve => setTimeout(resolve, msec, val));
async function aaa() {
	console.log(await wait(200, 'a'));
	console.log(await wait(200, 'b'));
	console.log(await wait(200, 'c'));
}
console.log('typeof aaa:', typeof aaa, aaa.name);
console.log('aaa.constructor.name:', aaa.constructor.name);
Object.getOwnPropertyNames(aaa)
.forEach(x => console.log(aaa.name + '.' + x + ':', typeof aaa[x], '=', JSON.stringify(aaa[x])));
aaa();
