'use strict';

module.exports = asyncSqlite;

/**
 * asyncSqlite - make thenable SQLite object. Database or Statement.
 * @param {*} obj
 * @returns obj
 */
function asyncSqlite(obj) {
	// make thenable methods for Database and Statement
	const methods = [
		'run', 'exec', 'get', 'all', 'each',
		'close', 'map', 'loadExtension',
		'bind', 'reset', 'finalize',
	];

	methods.forEach(key => {
		const func = obj[key];
		if (typeof func === 'function') {
			obj[key] = (...args) => ({then: (res, rej) => {
				try {
					func.apply(obj,
						[...args,
						(err, val) => err ? rej(err) : res(val)]);
				}
				catch (err) { rej(err); }
			}});
		}
	});

	// prepare method of Database for Statement
	const prepare = obj.prepare;
	if (typeof prepare === 'function') {
		obj.prepare = (...args) => ({then: (res, rej) => {
			try {
				const stmt = asyncSqlite(prepare.apply(obj,
					[...args, err => err ? rej(err) : res(stmt)]));
			}
			catch (err) { rej(err); }
		}});
	}

	return obj;
}
