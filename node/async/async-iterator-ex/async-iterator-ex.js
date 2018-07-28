// https://github.com/tc39/proposal-async-iteration

'use strict';

/*
interface Iterator {
	next(value) : IteratorResult;
	[optional] throw(value) : IteratorResult;
	[optional] return(value) : IteratorResult;
}

interface IteratorResult {
	value : any;
	done : bool;
}

interface AsyncIterator {
	next(value) : Promise<IteratorResult>;
	[optional] throw(value) : Promise<IteratorResult>;
	[optional] return(value) : Promise<IteratorResult>;
}

interface AsyncIterable {
	[Symbol.asyncIterator]() : AsyncIterator
}
*/

const wait = (msec, val) => new Promise(resolve => setTimeout(resolve, msec, val));

/*
// For example:

asyncIterator.next().then(result => console.log(result.value));
*/


function *asyncIteratorGenerator() {
	console.log('#1', yield wait(500, '#1'));
	console.log('#2', yield wait(500, '#2'));
	console.log('#3', yield wait(500, '#3'));
	return '#final';
}

let resolve, p = new Promise(r => resolve = r);

let asyncIterator = asyncIteratorGenerator();
asyncIterator.next('##0').value
.then(result => console.log(result))
.then(_ => { let val = asyncIterator.next('##1'); return val.done ? '#end' : val.value; })
.then(result => console.log(result))
.then(_ => { let val = asyncIterator.next('##2'); return val.done ? '#end' : val.value; })
.then(result => console.log(result))
.then(_ => { let val = asyncIterator.next('##3'); return val.done ? '#end' : val.value; })
.then(result => resolve(result));

/*
IterationStatement :
	for await ( LeftHandSideExpression of AssignmentExpression ) Statement

IterationStatement :
	for await ( var ForBinding of AssignmentExpression ) Statement

IterationStatement :
	for await ( ForDeclaration of AssignmentExpression ) Statement
*/

const aa = require('aa');

p.then(_ => aa(function *() {
	console.log('$$$');
	console.log('$1', yield wait(500, '$1'));
	console.log('$2', yield wait(500, '$2'));
	console.log('$3', yield wait(500, '$3'));
	return console.log('$final'), '$final';
}));
