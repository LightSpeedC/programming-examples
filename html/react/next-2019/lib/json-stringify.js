export default function jsonStringify(obj, depth = null, indent = '  ', default_indent = '', wm = new WeakMap(), level = 0) {
	++level;
	const ind = default_indent + indent;
	switch (typeof obj) {
		case 'undefined':
			return '"(undefined)"';
		case 'number':
		case 'string':
		case 'boolean':
			return JSON.stringify(obj);
		case 'object':
			if (obj == null) return 'null';
			if (wm.get(obj)) return '"(same object or recursive)"';
			wm.set(obj, true);
			if (obj.constructor === Object) {
				return '{\n' + ind + Object.keys(obj).map(x => JSON.stringify(x) + ': ' +
					jsonStringify(obj[x], depth, indent, ind, wm, level)).join(',\n'+ ind) +
					'\n' + default_indent + '}';
			}
			else if (obj.constructor === Array) {
				return '[\n' + ind + obj.map(x =>
					jsonStringify(x, depth, indent, ind, wm, level)).join(',\n'+ ind) +
					'\n' + default_indent + ']';
			}
			else
				return '"(object: ' + (obj.constructor && obj.constructor.name || '') + ': ' + Object.keys(obj).join(', ') +')"';
		default:
			return '"(' + typeof obj + ')"';
	}
}
