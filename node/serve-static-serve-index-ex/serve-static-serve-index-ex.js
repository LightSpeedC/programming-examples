'use strict';

// Serve directory indexes for current folder (with icons)
const serveIndex = require('serve-index')('.', {icons: true});
// Serve up current folder files
const serveStatic = require('serve-static')('.');
const finalhandler = require('finalhandler');

// Create http server 
require('http').createServer(function onRequest(req, res) {
	console.log(req.method, req.url);
	const done = finalhandler(req, res);
	//const done = function (err) {
	//	res.statusCode = 404;
	//	res.end(err ? err + '' : '404 Not Found : ' + req.url);
	//};
	serveStatic(req, res, function onNext(err) {
		if (err) return done(err)
		serveIndex(req, res, done)
	})
})
// Listen
.listen(process.env.PORT || 3000);
