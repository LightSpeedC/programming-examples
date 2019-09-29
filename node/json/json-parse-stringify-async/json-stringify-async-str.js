'use strict';

module.exports = jsonStringifyAsync;

// jsonStringifyAsync *****************************************************************
async function jsonStringifyAsync(obj) {
	let str = '';

	await jsonStringifyInternal(obj);

	return str;

	// jsonStringifyInternal
	async function jsonStringifyInternal(obj) {
		if (obj == null) {
			str += 'null';
			return;
		}

		switch (typeof obj) {
			case 'number':
				str += String(obj);
				return;

			case 'string':
				str += JSON.stringify(obj);
				return;

			case 'boolean':
				str += obj ? 'true' : 'false';
				return;

			case 'object':
				let comma = false;

				if (obj.constructor === Object) {
					str += '{';
					for (let key in obj) {
						if (comma) str += ',';
						else comma = true;
						str += JSON.stringify(key) + ':';
						await jsonStringifyInternal(obj[key]);
					}
					str += '}';
					return;
				}
				else if (obj.constructor === Array) {
					str += '[';
					for (let key = 0; key < obj.length; ++key) {
						if (comma) str += ',';
						else comma = true;
						await jsonStringifyInternal(obj[key]);
					}
					str += ']';
					return;
				}
				else throw new TypeError('unknown json type: object ' + obj.constructor.name + ' ' + obj);
			default:
				throw new TypeError('unknown json type: ' + typeof obj);
		}
	}
}
