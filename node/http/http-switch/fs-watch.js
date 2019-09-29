'use strict';

const fs = require('fs');

module.exports = function fsWatch(file, listener) {
	if (typeof file !== 'string')
		throw new TypeError('first argument file: string');

	if (typeof listener !== 'function')
		throw new TypeError('second argument listener: function');

	let timer = null;

	fs.watch(file, watcher);

	function watcher(event, file) {
		if (timer) clearTimeout(timer);
		timer = setTimeout(listener, 100, event, file);
	}
};
