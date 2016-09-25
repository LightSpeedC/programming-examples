'use strict';

const aa = require('aa');

// Serve directory indexes for current folder (with icons)
const serveIndex = require('serve-index')('.', {icons: true});
// Serve up current folder files
const serveStatic = require('serve-static')('.');
//const finalhandler = require('finalhandler');

// aa.callback(gtor)
if (!aa.callback)
	aa.callback = function callback(gtor) {
		return function () {
			return aa(gtor.apply(this, arguments));
		};
	};

// new thunkify (with timeout)
function thunkify(fn, opts) {
	return function () {
		let cb, timer;
		if (opts && opts.timeout && opts.error)
			timer = setTimeout(cb1, opts.timeout, opts.error);

		arguments[arguments.length++] = cb1;
		fn.apply(this, arguments);

		return function thunk(cb2) { cb = cb2; };

		function cb1() {
			if (timer) timer = clearTimeout(timer);
			cb.apply(this, arguments);
		}
	};
}

const OK_ERROR = new Error('OK');
const serveIndexAsync  = thunkify(serveIndex,  {timeout: 200, error: OK_ERROR});
const serveStaticAsync = thunkify(serveStatic, {timeout: 200, error: OK_ERROR});
let id = 1000;

// Create http server 
require('http').createServer(aa.callback(function *onRequest(req, res) {
	let msg = 'initialized';
	console.log(++id + ':', req.method, req.url, '(req)');
	try {
		msg = 'serve-static';
		yield serveStaticAsync(req, res);
		msg = 'serve-index';
		yield serveIndexAsync(req, res);
		msg = 'no-handler';
		res.statusCode = 404;
		res.end('404 Not Found : ' + req.url);
	} catch (err) {
		if (err === OK_ERROR)
			return console.log(id + ':', req.method, req.url, msg);

		res.statusCode = 404;
		res.end(err + ' 404 Not Found : ' + req.url);
	}
}))
// Listen
.listen(process.env.PORT || 3000);
