// ディレクトリやファイルを探す

void function () {
	'use strict';

	module.exports = findDirFiles;

	const path = require('path');
	const fs = require('fs');
	const aa = require('aa');
	const Executors = require('executors');

	aa.thunkifyAll(fs);
	if (typeof fs.statAsync !== 'function')
		throw new TypeError('eh!? statAsync');
	if (typeof fs.readdirAsync !== 'function')
		throw new TypeError('eh!? readdirAsync');

	const exec1 = Executors(5);
	const exec2 = Executors(5);
	const ERROR_PROP = '*';
	const cancelError = new Error('キャンセル');
	const cancelData = new SpecialData(ERROR_PROP, cancelError);

	function SpecialData(prop, val) {
		if (arguments.length !== 0)
			this[prop] = val;
	}

	findDirFiles.ERROR_PROP = ERROR_PROP;
	function *findDirFiles(dir, pattern, progressCallback, wholeObject, controller) {
		const result = new SpecialData();
		if (!wholeObject) wholeObject = result;
		if (!controller) controller = {};
		if (controller.isCancel) return cancelData;
		try {
			const names = yield exec1(fs.readdirAsync, dir);
			if (controller.isCancel) {
				result[ERROR_PROP] = cancelError;
				return result;
			}
			//for (let name of names) {
			yield names.map(name => function *() {
				result[name] = undefined;
				try {
					var file = path.resolve(dir, name);
					const stat = yield exec2(fs.statAsync, file);
					if (controller.isCancel) {
						result[name] = cancelData;
						return;
					}
					if (stat.isDirectory()) {
						const r = yield findDirFiles(file, pattern, progressCallback, wholeObject, controller);
						if (controller.isCancel) {
							result[name] = cancelData;
							return;
						}
						if (r || name.includes(pattern)) {
							result[name] = r || {};
							progressCallback({isDirectory:true, file: file + path.sep, wholeObject, dir, name, stat});
						}
						else delete result[name];
					}
					else if (name.includes(pattern)) {
						result[name] = null;
						progressCallback({isDirectory:false, file, wholeObject, dir, name, stat});
					}
					else delete result[name];
				} catch (e) {
					result[name] = new SpecialData(ERROR_PROP, e);
				}
			});
			return (Object.keys(result).length || undefined) && result;
		} catch (e) {
			result[ERROR_PROP] = e;
			return result;
		}
	}

}();
