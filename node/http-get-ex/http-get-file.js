// http-get-file.js

(function () {
	'use strict';

	var http = require('http');
	var url  = require('url');
	var fs   = require('fs');
	var path = require('path');
	var util = require('util');
	var Promise = require('promise-light');

	// environment variables
	var HTTP_PROXY_SERVER_URL  = process.env.HTTP_PROXY;
	var errFile  = '-error-file.txt';
	var NEWLINE = '\r\n';
	var errCount = 0;

	//######################################################################
	function httpGetFile(targetURL, outFile, outDir) { 
		// arguments
		outFile = outFile || 'output-file.txt';

		// no arguments, print usage
		if (!targetURL)
			throw new Error('targetURL must be specified !!!');

		return new Promise(function (resolve, reject) {

			var x = url.parse(targetURL);

			// using proxy server or no proxy
			if (HTTP_PROXY_SERVER_URL) {
				// using proxy server
				// console.log('using proxy server: ' + HTTP_PROXY_SERVER_URL);
				var y = url.parse(HTTP_PROXY_SERVER_URL);
				var options = {
					host: y.hostname, 
					port: y.port || 80,
					path: targetURL, 
					headers: {host: x.hostname}
				};
			}
			else {
				// no proxy, direct access
				var options = {
					host: x.hostname, 
					port: x.port || 80,
					path: x.path, 
					headers: {host: x.hostname}
				};
				// console.log('host: ' + options.host);
				// console.log('port: ' + options.port);
				// console.log('path: ' + options.path);
			}

			// http request
			var req = http.get(options, function onSvrRes(res) {
				if (res.statusCode === 200) {
					// ok
					// console.log('******************* Successful *****************');
					// console.log('Downloaded file: ' + outFile); 
					var w = fs.createWriteStream(path.resolve(outDir, outFile));
					res.pipe(w);
					res.on('end', function () {
						// console.log('###', targetURL);
						resolve();
					});
				}
				else {
					// error
					var errFileName = ('0000' + (++errCount)).substr(-4) + errFile;
					// console.log('Error: ' + res.statusCode);
					// console.log(res.headers);
					// console.log('error file: ' + errFileName);
					var w = fs.createWriteStream(path.resolve(outDir, errFileName));
					w.write('HTTP GET ' + targetURL + NEWLINE);
					w.write('Can not output: ' + outFile + NEWLINE);
					w.write('Status: ' + res.statusCode + ' ' + res.statusMessage + NEWLINE);
					w.write('Headers: ' + util.inspect(res.headers, {depth: null}) + NEWLINE);
					w.write('error file: ' + errFileName + NEWLINE);
					w.write('==================================================' + NEWLINE);
					w.write(NEWLINE);
					var err = new Error('Error ' + res.statusCode + ' ' + res.statusMessage +
						' ' + targetURL);
					err.code = res.statusCode;
					err.msg = res.statusMessage;
					err.url = targetURL;
					err.file = errFileName;
					res.pipe(w);
					res.on('end', function () {
						// console.log('###', targetURL);
						reject(err);
					});
				}
			});

		});

	} // httpGetFile

	module.exports.httpGetFile = httpGetFile;

})();
