'use strict';

console.log('a.js');
console.log('typeof global: ', typeof global);
console.log('typeof process:', typeof process);
console.log('typeof window: ', typeof window);
console.log('typeof self:   ', typeof self);

if (!console.debug) console.debug = console.error;

if (typeof JSON !== 'object') {
	Function('return this')().JSON = { stringify: function stringify(obj) {
			console.debug('JSON.stringify: ' + obj);
			return obj + '';
		} };
}

if (!Array.prototype.indexOf) {
	console.log('def: Array.prototype.indexOf');
	Array.prototype.indexOf = function (elem) {
		console.debug('[].indexOf: called');
		for (var i = 0; i < this.length; ++i) if (this[i] === elem) return i;
		return -1;
	};
}

function stringify(obj, indentStr) {
	var circulars = [];
	if (!indentStr) indentStr = '';
	var str = stringify2(obj, indentStr, 0, indentStr ? '\n' : '');
	circulars = [];
	return str;

	function stringify2(obj, indentStr, level, cumStr) {
		if (obj == null) return obj + '';
		if (typeof obj !== 'object') return JSON.stringify(obj);
		if (circulars.indexOf(obj) >= 0) return '(circular)';
		circulars.push(obj);

		++level;
		cumStr += indentStr;

		if (obj.constructor === Array) {
			if (obj.length === 0) return '[]';
			var str = '[ ' + cumStr + stringify2(obj[0], indentStr, level, cumStr);
			if (obj.length === 1) return str + ' ]';
			for (var i = 1; i < obj.length; ++i) str += ', ' + cumStr + stringify2(obj[i], indentStr, level, cumStr);
			return str + ' ]';
		}

		var keys = Object.keys(obj); //Object.getOwnPropertyNames(obj);
		if (keys.length === 0) return '{}';
		try {
			var y = obj[keys[0]];
		} catch (e) {
			y = keys[0] + e;
		}
		var x = stringify2(y, indentStr, level, cumStr);
		var str = '{ ' + cumStr + JSON.stringify(keys[0]) + ': ' + x;
		if (keys.length === 1) return str + ' }';
		for (var i = 1; i < keys.length; ++i) {
			try {
				var y = obj[keys[i]];
			} catch (e) {
				y = keys[i] + e;
			}
			str += ', ' + cumStr + JSON.stringify(keys[i]) + ': ' + stringify2(y, indentStr, level, cumStr);
		}
		return str + ' }';
	}
}
if (typeof process === 'object') console.log('process =', stringify(process, '  '));
if (typeof window === 'object') console.log('window =', stringify(window, '  '));

