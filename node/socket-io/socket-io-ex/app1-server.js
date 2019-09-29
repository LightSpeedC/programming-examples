void function () {
	'use strict';

	var app = require('http').createServer(handler)
	var io = require('socket.io')(app);
	var fs = require('fs');
	var path = require('path');

	// port number ポート番号
	var port = process.argv[2] || process.env.PORT || 3000;

	// time 時刻
	var tm = () => new Date().toLocaleTimeString();
	var mimes = {
		'.html':'text/html; charset=utf-8',
		'.js':'application/x-javascript; charset=utf-8'
	};

	app.listen(port, () =>
		console.log(tm(), 'server started: port', port));

	function handler(req, res) {
		console.log(tm(), req.method, req.url);
		var file = req.url === '/' ? '/app1.html' : req.url;
		fs.readFile(__dirname + file,
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + file);
			}

			res.writeHead(200, {'content-type':
					mimes[path.extname(file)] ||
					'text/plain; charset=utf-8'});
			res.end(data);
		});
	}

	io.on('connection', function (socket) {
		var msg = {hello:'world', 'こんにちは':'世界', tm:tm()};
		console.log(tm(), 'news:', msg);
		socket.emit('news', msg);
		socket.on('my other event', function (msg) {
			console.log(tm(), 'other:', msg);
		});
		socket.on('my timer event', function (msg) {
			console.log(tm(), 'timer:', msg);
		});
		socket.on('disconnect', function () {
			console.log(tm(), 'disconnect!');
		});
	});

}();
