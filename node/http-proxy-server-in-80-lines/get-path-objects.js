void function () {
	'use strict';
	var url = require('url');
	var root = {};
	var ports = {'http:':80, 'https:':443};
	var _stat = ' stat';

	function uri2arr(uri) {
		var x = url.parse(uri.includes('//') ? uri : uri = 'http://' + uri);
		return [x.protocol.split(':')[0]]
			.concat(x.hostname.split('.').reverse())
			.concat(':' + (x.port || ports[x.protocol]))
			.concat(x.pathname.split('/').filter(elem => elem));
	}

	function getPathObjects(root, uri) {
		//console.log(url.parse(uri));
		var elems = uri2arr(uri);
		var obj = root, arr = [obj];
		elems.forEach(elem => {
			if (!obj.hasOwnProperty(elem))
				obj[elem] = {};

			obj = obj[elem];
//			if (!obj[_stat])
//				obj[_stat] = {count:0, time:Date.now(), size:0};

//			obj[_stat].count++;
//			obj[_stat].time = Date.now();
//			obj[_stat].size += 100;
			arr.push(obj);
		});
		return arr;
	}
	module.exports = getPathObjects;

	// test code main
	if (module === require.main) {
		getPathObjects(root, 'http://www.google.com/index.html');
		getPathObjects(root, 'https://www.google.com/index.html');
		getPathObjects(root, 'http://www.facebook.com/index.html');
		getPathObjects(root, 'https://www.facebook.com/index.html');
		getPathObjects(root, 'http://www.group.net/index.html');
		getPathObjects(root, 'https://www.group.net/index.html');
		getPathObjects(root, 'www.facebook.com/index.html');
		getPathObjects(root, 'www.facebook.com:80');
		console.log(require('util').inspect(root, {colors:true, depth:null}));
	}
}();
