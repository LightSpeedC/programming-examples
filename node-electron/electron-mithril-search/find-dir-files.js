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
		const names = yield fs.readdirAsync(dir);
		const result = {};
		if (!wholeObject) wholeObject = result;
		yield names.map(name => function *() {
			const subDir = path.resolve(dir, name);
			const stat = yield fs.statAsync(subDir);
			if (stat.isDirectory()) {
				const r = yield findDirFiles(subDir, pattern, progressCallback, wholeObject);
				if (r || name.includes(pattern))
					result[name + path.sep] = r ||
						(progressCallback(subDir + path.sep, wholeObject), null) || {};
			}
			else if (name.includes(pattern)) {
				result[name] = null;
				progressCallback(subDir, wholeObject);
			}
		});
		return (Object.keys(result).length || null) && result;
	}

}();
