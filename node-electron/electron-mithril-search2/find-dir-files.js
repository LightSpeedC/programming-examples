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

	const PARENT_PROP = ' parent';
	const CLEAN_PROP = ' clean';
	const ERROR_PROP = '*';
	const CANCEL_ERROR = new Error('キャンセル');

	// 特殊なデータ・クラス
	function SpecialData(prop, val) {
		if (arguments.length !== 0)
			this[prop] = val;
	}

	// ディレクトリとファイルを検索
	function *findDirFiles(dir, pattern, controller) {
		if (!controller) controller = {};
		if (controller.isCancel)
			return new SpecialData(ERROR_PROP, CANCEL_ERROR);
		const maxFiles = controller.maxFiles || 3000;
		const maxTotalFiles = controller.maxTotalFiles || 100000;
		const {progress} = controller;
		let wholeObject;
		let filesCount = 0;

		const xqtor1 = Executors(2);
		const xqtor2 = Executors(2);
		const result = yield *find(dir);

		if (filesCount > maxTotalFiles)
			result[ERROR_PROP] = new RangeError(
				'合計ファイル数の制限 (' +
				maxTotalFiles + ') を超えました (' +
				filesCount + ')');

		if (result[ERROR_PROP] === undefined)
			delete result[ERROR_PROP];

		return result;

		// cancel
		function *cancel() {
			try {
				yield *xqtor1.cancel();
				yield *xqtor2.cancel();
			} catch(e) {
				yield *xqtor1.end();
				yield *xqtor2.end();
			}
		}

		// find
		function *find(dir) {
			const result = new SpecialData();
			if (!wholeObject) {
				wholeObject = result;
				wholeObject[ERROR_PROP] = undefined;
				setDirty(result);
				progress &&
				progress({isDirectory:true, file: dir, wholeObject, dir, name: '', stat: null});
			}

			try {
				const names = yield xqtor1(readdirAsync, dir);
				if (controller.isCancel) {
					result[ERROR_PROP] = CANCEL_ERROR;
					setDirty(result);
					yield *cancel();
					return result;
				}
				if (names.length > maxFiles) {
					result[ERROR_PROP] = new RangeError(
						'ファイル数の制限 (' +
						maxFiles + ') を超えました (' +
						names.length + ')');
					setDirty(result);
					return result;
				}
				filesCount += names.length;
				if (filesCount > maxTotalFiles)
					return undefined;

				//for (let name of names) {
				yield names.map(name => function *() {
					result[name] = undefined;
					setDirty(result);
					try {
						var file = path.resolve(dir, name);
						const stat = yield xqtor2(statAsync, file);
						if (controller.isCancel) {
							result[name] = new SpecialData(ERROR_PROP, CANCEL_ERROR);
							setDirty(result);
							return yield *cancel();
						}
						if (stat.isDirectory()) {
							const r = yield *find(file);
							if (controller.isCancel) {
								result[name] = new SpecialData(ERROR_PROP, CANCEL_ERROR);
								setDirty(result);
								return yield *cancel();
							}
							if (r || name.includes(pattern)) {
								result[name] = r || new SpecialData();
								r[PARENT_PROP] = result;
								setDirty(result);
								progress &&
								progress({isDirectory:true, file: file + path.sep, wholeObject, dir, name, stat});
							}
							else delete result[name];
						}
						else if (name.includes(pattern)) {
							result[name] = null;
							setDirty(result);
							progress &&
							progress({isDirectory:false, file, wholeObject, dir, name, stat});
						}
						else delete result[name];
					} catch (e) {
						result[name] = new SpecialData(ERROR_PROP, e);
						setDirty(result);
					}
				});
				return (validKeysCount(result) || undefined) && result;
			} catch (e) {
				result[ERROR_PROP] = e;
				setDirty(result);
				return result;
			}

		} // find

		function setDirty(x) {
			do { x[CLEAN_PROP] = false; }
			while (x = x[PARENT_PROP]);
		}

		function validKeysCount(x) {
			return Object.keys(x).filter(x => !x.startsWith(' ')).length;
		}

	} // findDirFiles
	findDirFiles.ERROR_PROP = ERROR_PROP;
	findDirFiles.CLEAN_PROP = CLEAN_PROP;

}();