(function () {
	'use strict';
	var Promise = require('promise-light');

	var httpGetFile = require('./http-get-file.js').httpGetFile;

	var interfaces = ['MyCmn', 'MyDbm', 'MyFgu', 'MyGbr', 'MyGco',
					'MyLoc', 'MyScm', 'MySki', 'MySym', 'MyTky',
					'FeAtn', 'FeDbm', 'FeFgu', 'FeGco', 'FeScm',
					'FeSki', 'FeTky']; 

	require('mkdir-parents').mkdirParentsSync('logs');

	Promise.all(
		interfaces.map(function (x) {
			return httpGetFile('http://localhost:8080/myami-app/' + x + '?wsdl', x + '.wsdl', 'logs/')
				.then(function () { console.log('@@@', x, 'end'); },
					function (e) {console.log('@@@', x, e); return Promise.reject(e); });
		})
	).then(function () {console.log('@@@ ALL end');},
		function (e) {console.log('@@@ SOME Promise Error', e);});

})();
