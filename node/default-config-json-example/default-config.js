// default-config.js

void function () {
	var fs = require('fs');
	var path = require('path');

	function tryRequire(file) {
		try { return require(file); }
		catch (e) {}
	}

	function defaultConfig(localConfigFile, defaultConfigFile, delim) {
		var ext = path.extname(localConfigFile) || '.json';
		var dir = path.dirname(localConfigFile);
		var base = path.basename(localConfigFile, ext);

		var host = (process.env.COMPUTERNAME || process.env.HOSTNAME || 'local').toLowerCase();

		var file = path.resolve(dir, base + '-' + host + ext);
		var data = tryRequire(file);
		if (data) return data;

		data = require(path.resolve(defaultConfigFile));
		var str = JSON.stringify(data, null, delim);
		fs.writeFileSync(file + (ext ? '' : '.json'), str + '\n');
		return data;
	}

	module.exports = defaultConfig;

}();
