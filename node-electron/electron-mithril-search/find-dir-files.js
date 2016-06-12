// ディレクトリやファイルを探す

void function () {
	'use strict';

	module.exports = findDirFiles;

	const path = require('path');
	const fs = require('fs');
	const aa = require('aa');
	const Executors = require('executors');

	const statAsync = aa.thunkify(fs, fs.stat);
	const readdirAsync = aa.thunkify(fs, fs.readdir);
	//aa.thunkifyAll(fs);
	if (typeof statAsync !== 'function')
		throw new TypeError('eh!? statAsync');
	if (typeof readdirAsync !== 'function')
		throw new TypeError('eh!? readdirAsync');

	const ERROR_PROP = '*';
	const CANCEL_ERROR = new Error('キャンセル');
	const CANCEL_DATA = new SpecialData(ERROR_PROP, CANCEL_ERROR);

	// 特殊なデータ・クラス
	function SpecialData(prop, val) {
		if (arguments.length !== 0)
			this[prop] = val;
	}

	// ディレクトリとファイルを検索
	function *findDirFiles(dir, pattern, controller) {
		if (!controller) controller = {};
		if (controller.isCancel) return CANCEL_DATA;
		const {progress} = controller;
		let wholeObject;

		const xqtor1 = Executors(5);
		const xqtor2 = Executors(5);
		return yield *find(dir);

		// cancel
		function *cancel() {
			yield *xqtor1.cancel();
			yield *xqtor2.cancel();
		}

		// find
		function *find(dir) {
			const result = new SpecialData();
			if (!wholeObject) {
				wholeObject = result;
				progress &&
				progress({isDirectory:true, file: dir, wholeObject, dir, name: '', stat: null});
			}

			try {
				const names = yield xqtor1(readdirAsync, dir);
				if (controller.isCancel) {
					result[ERROR_PROP] = CANCEL_ERROR;
					yield *cancel();
					return result;
				}
				//for (let name of names) {
				yield names.map(name => function *() {
					result[name] = undefined;
					try {
						var file = path.resolve(dir, name);
						const stat = yield xqtor2(statAsync, file);
						if (controller.isCancel) {
							result[name] = CANCEL_DATA;
							return yield *cancel();
						}
						if (stat.isDirectory()) {
							const r = yield *find(file);
							if (controller.isCancel) {
								result[name] = CANCEL_DATA;
								return yield *cancel();
							}
							if (r || name.includes(pattern)) {
								result[name] = r || {};
								progress &&
								progress({isDirectory:true, file: file + path.sep, wholeObject, dir, name, stat});
							}
							else delete result[name];
						}
						else if (name.includes(pattern)) {
							result[name] = null;
							progress &&
							progress({isDirectory:false, file, wholeObject, dir, name, stat});
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

		} // find

	} // findDirFiles
	findDirFiles.ERROR_PROP = ERROR_PROP;

}();
