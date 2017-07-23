'use strict';

let spc = ' ';
function pad(s, n) {
	if (s.length >= n) return s;
	while (spc.length < n) spc += spc;
	return (s + spc).substr(0, n);
}

function ff() {
}
function *gg() {
}

x('ff', ff);
x('gg', gg);
x('gt', gg());

function x(nm, fn) {
	let msg = 'typeof ' + nm + ': ' + pad(typeof fn, 9) +
		pad(fn.name || '', 2) + ' ' +
		pad(Object.getOwnPropertyNames(fn), 23) +
		pad(Object.getOwnPropertyNames(fn.constructor.prototype), 70) +
		nm + '.ctor: ' + pad(typeof fn.constructor, 9) +
		('name' in fn.constructor ? fn.constructor.name : '') +
		('displayName' in fn.constructor ? ' ' + nm + '.ctor.displayName: ' + fn.constructor.displayName : '');
	console.log(msg);
}
