'use strict';

module.exports = mkdirParentsAsync;

const fs = require('fs');
const path = require('path');
const util = require('util');

const accessAsync = util.promisify(fs.access);
const mkdirAsync = util.promisify(fs.mkdir);

async function mkdirParentsAsync(dir) {
	try {
		await accessAsync(dir);
	}
	catch (err) {
		await mkdirParentsAsync(path.resolve(dir, '..'));
		try {
			await mkdirAsync(dir);
		}
		catch (err) {
			if (err.code !== 'EEXIST')
				throw err;
		}
	}
}
