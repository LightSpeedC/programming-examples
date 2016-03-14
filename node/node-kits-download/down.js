void function () {
	'use strict';

	var fs = require('fs');
	var aa = require('aa');
	var fetch = require('./fetch');

	var writeFileA = aa.thunkify(fs, fs.writeFile);

	aa(function *() {
		var res = yield {
			a:fetch({writeFile:'a.log'},
				'https://nodejs.org/dist/'),
			n:fetch({writeFile:'npm-versions.log'},
				'https://nodejs.org/dist/npm-versions.txt'),
			i:fetch({writeFile:'index.log'},
				'https://nodejs.org/dist/index.json'),
			b:fetch('https://nodejs.org/dist/'),
		};
		console.log('fetch results[]:', res);
		yield writeFileA('b.log', res.b.data);
	});
}();
