'use strict';

module.exports = jsonStringifyAsync;

// jsonStringifyAsync *****************************************************************
async function jsonStringifyAsync(obj) {
	if (obj == null) return 'null';
	switch (typeof obj) {
		case 'object':
			const list = [];
			if (obj.constructor === Object) {
				for (let key in obj)
					list.push(JSON.stringify(key) + ':' + await jsonStringifyAsync(obj[key]));
				return '{' + list.join(',') + '}';
			}
			else if (obj.constructor === Array) {
				for (let key = 0; key < obj.length; ++key)
					list.push(await jsonStringifyAsync(obj[key]));
				return '[' + list.join(',') + ']';
			}
			else throw new TypeError('unknown json type: object ' + obj.constructor.name + ' ' + obj);
		case 'number':
			return String(obj);
		case 'string':
			return JSON.stringify(obj);
		case 'boolean':
			return obj ? 'true' : 'false';
		default:
			throw new TypeError('unknown json type: ' + typeof obj);
	}
}
