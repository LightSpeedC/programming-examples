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

	function *findDirFiles(dir, pattern, progressCallback, wholeObject, controller) {
		const result = {};
		if (!wholeObject) wholeObject = result;
		if (!controller) controller = {};
		if (controller.isCancel) {
			const e = new Error('Cancel');
			result['*'] = e;
			return result;
		}
		try {
			const names = yield fs.readdirAsync(dir);
			names.forEach(name => result[name] = undefined);
			for (let name of names) {
			//yield names.map(name => function *() {
				if (controller.isCancel) {
					const e = new Error('Cancel');
					result[name] = {'*': e};
					return;
				}
				try {
					var file = path.resolve(dir, name);
					const stat = yield fs.statAsync(file);
					if (controller.isCancel) return;
					if (stat.isDirectory()) {
						const r = yield findDirFiles(file, pattern, progressCallback, wholeObject, controller);
						if (r || name.includes(pattern)) {
							result[name] = r || {};
							if (name.includes(pattern))
								progressCallback({isDirectory:true, file: file + path.sep, wholeObject, dir, name, stat});
						}
					}
					else if (name.includes(pattern)) {
						result[name] = null;
						progressCallback({isDirectory:false, file, wholeObject, dir, name, stat});
					}
				} catch (e) {
					result[name] = {'*': e};
				}
			//});
			}
			return (Object.keys(result).length || null) && result;
		} catch (e) {
			result['*'] = e;
			return result;
		}
	}

}();
