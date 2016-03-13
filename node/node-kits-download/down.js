void function () {
	'use strict';

	var fs = require('fs');
	var fetch = require('./fetch');

	var aa = require('aa');
	var writeFileA = aa.thunkify(fs, fs.writeFile);

	aa(function *() {
		var a = yield [
			fetch({writeFile:'a.log'},
				'https://nodejs.org/dist/'),
			fetch({writeFile:'npm-versions.log'},
				'https://nodejs.org/dist/npm-versions.txt'),
			fetch({},
				'https://nodejs.org/dist/'),
		];
		console.log('fetch results[]:', a);
		yield writeFileA('b.log', a[2].data);
	});
}();
