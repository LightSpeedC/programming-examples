(function () {
	'use strict';
	var fs = require('fs');
	var url = require('url');
	var path = require('path');
	var port = process.argv[2] || process.env.PORT || 3000;
	console.log('port:', port);
	var express = require('express'), app = express();
	fs.readdirSync('.').filter(function (file) {
		return !file.startsWith('.') &&
			file !== 'node_modules' &&
			fs.statSync(file).isDirectory();
	}).forEach(
		function (dir) {
			app.use('/' + dir, express.static(dir));
		});
	app.get('/*', function (req, res) {
		var x = url.parse(req.url);
		if (x.pathname === '/' || x.pathname === '/index.html')
			res.sendFile(path.resolve('index.html'));
		else if (x.pathname === '/index.json')
			res.sendFile(path.resolve('index.json'));
		else
			res.status(404).send('file not found');
	});
	app.listen(port);
})();
