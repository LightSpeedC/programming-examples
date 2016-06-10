// ディレクトリやファイルを探す

void function () {
	'use strict';

	module.exports = findDirFiles;

	const path = require('path');
	const fs = require('fs');
	const aa = require('aa');
	aa.thunkifyAll(fs);
	if (typeof fs.statAsync !== 'function')
		throw new TypeError('eh!? statAsync');
	if (typeof fs.readdirAsync !== 'function')
		throw new TypeError('eh!? readdirAsync');

	function *findDirFiles(dir, pattern, progressCallback, wholeObject) {
		const result = {};
		if (!wholeObject) wholeObject = result;
		try {
			var names = yield fs.readdirAsync(dir);
		} catch (e) {
			result['*'] = e;
			return result;
		}
		yield names.map(name => function *() {
			const file = path.resolve(dir, name);
			const stat = yield fs.statAsync(file);
			if (stat.isDirectory()) {
				const r = yield findDirFiles(file, pattern, progressCallback, wholeObject);
				if (r || name.includes(pattern)) {
					result[name] = r || {};
					if (!r) progressCallback({isDirectory:true, file, wholeObject, dir, name, stat});
				}
			}
			else if (name.includes(pattern)) {
				result[name] = null;
				progressCallback({isDirectory:false, file, wholeObject, dir, name, stat});
			}
		});
		return (Object.keys(result).length || null) && result;
	}

}();
