'use strict';

module.exports = jsonStringifyAsync;

// jsonStringifyAsync *****************************************************************
async function jsonStringifyAsync(obj) {
	const list = [];

	await jsonStringifyInternal(obj);

	return list.join('');

	// jsonStringifyInternal
	async function jsonStringifyInternal(obj) {
		if (obj == null) {
			list.push('null');
			return;
		}

		switch (typeof obj) {
			case 'number':
				list.push(String(obj));
				return;

			case 'string':
				list.push(JSON.stringify(obj));
				return;

			case 'boolean':
				list.push(obj ? 'true' : 'false')
				return;

			case 'object':
				let comma = false;

				if (obj.constructor === Object) {
					list.push('{');
					for (let key in obj) {
						if (comma) list.push(',');
						else comma = true;
						list.push(JSON.stringify(key), ':');
						await jsonStringifyInternal(obj[key]);
					}
					list.push('}');
					return;
				}
				else if (obj.constructor === Array) {
					list.push('[');
					for (let key = 0; key < obj.length; ++key) {
						if (comma) list.push(',');
						else comma = true;
						await jsonStringifyInternal(obj[key]);
					}
					list.push(']');
					return;
				}
				else throw new TypeError('unknown json type: object ' + obj.constructor.name + ' ' + obj);
			default:
				throw new TypeError('unknown json type: ' + typeof obj);
		}
	}
}
