'use strict';

const jsonStringifyAsync = require('./json-stringify-async');
const jsonParseAsync = require('./json-parse-async');

// main *****************************************************************
async function main() {
	await bench('null', null);
	await bench('true', true);
	await bench('false', false);
	await bench('"str"', "str");
	await bench('1', 1);
	await bench('123', 123);
	await bench('123.5', 123.5);
	await bench('1.23e+30', 1.23e+30);
	await bench('[]', []);
	await bench('{}', {});
	await bench('[null,true,false]', [null,true,false]);
	await bench('{x:null,y:true,z:false}', {x:null,y:true,z:false});
	await bench('[1,2,3]', [1,2,3]);
	await bench('{x:1,y:2,z:3}', {x:1,y:2,z:3});
	await bench('["a","b","c"]', ['a','b','c']);
	await bench('{x:"a",y:"b",z:"c"}', {x:'a',y:'b',z:'c'});
	await bench('[err]', [new Error('err')]);
	await benchParse('1', '1');
	await benchParse('1.2', '1.2');
	await benchParse('123.', '123.');
}

// bench *****************************************************************
async function bench(memo, obj) {
	console.log('----------------------------------------------------------');
	try {
		const str = await jsonStringifyAsync(obj);
		console.log(memo + ':', str);
		if (str !== JSON.stringify(obj))
			console.error('***************** stringify err! **************');
		const newObj = await jsonParseAsync(str);
		if (str !== JSON.stringify(newObj))
			console.error('***************** parse err! **************', newObj);
	}
	catch (err) {
		console.log(memo + ':', obj);
		console.error('******* ' + err);
	}
}

// benchParse *****************************************************************
async function benchParse(memo, str) {
	console.log('----------------------------------------------------------');
	try {
		const obj = await jsonParseAsync(str);
		console.log(memo + ':', str);
		if (JSON.stringify(JSON.parse(str)) !== JSON.stringify(obj))
			console.error('***************** parse err! **************');
	}
	catch (err) {
		console.log(memo + ':', str);
		console.error('******* ' + err);
	}
}

main().catch(err => console.error(err));
