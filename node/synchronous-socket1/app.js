void function () {
	'use strict';
	var port = process.argv[2] || process.env.PORT || 3000;
	console.log('port:', port);

	var fs = require('fs');
	var http = require('http');
	var path = require('path');
	var util = require('util');

	var app = http.createServer(httpRequestHandler);
	var io = require('socket.io')(app);
	app.listen(port);

	var mimes = {'.ico': 'image/x-icon', '.js':'text/javascript'};

	function httpRequestHandler(req, res) {
		console.log(req.method, req.url);
		var file = path.resolve(__dirname, '.' +
			(req.url === '/' ? '/index.html' : req.url));
		res.statusCode = 200;
		res.setHeader('content-type',
			mimes[path.extname(file)] || 'text/html');
		var reader = fs.createReadStream(file);
		reader.pipe(res)
		reader.on('error', function (err) {
			console.log(err);
			res.statusCode = 404;
			res.setHeader('content-type', 'text/plain');
			res.end(util.inspect(err).replace(/\\\\/g, '\\')
				.replace(__dirname, '*').replace(__dirname, '*'));
		});
	}

	var master;
	var conns = [];

	io.on('connection', socket => {
		conns.push(socket);
		console.log('connection', !!master);

		// masterが存在しなければ、コネクション成立したものをmasterにする
		if (!master) {
			master = socket;
			socket.emit('sync-canvas-you-are-master');
		}
		// master以外の接続の場合masterに位置情報を送信を依頼(新規ユーザーのため)
		else if (master !== socket)
			master.emit('sync-canvas-send-update');

		// masterからの位置情報が来れば全員に知らせる
		socket.on('sync-canvas-broadcast', data => {
			console.log('move', data);

			data.onlineCount = conns.length;

			//運動状態を送信
			if (master === socket)
				io.emit('sync-canvas-move', data);
		});

		// 切断時
		socket.on('disconnect', () => {
			console.log('disconnect', conns.length, '->', conns.length - 1);
			conns = conns.filter(s => s !== socket);
			// masterが死んだら誰かを新しくmasterに昇格させる
			if (socket === master)
				(master = conns[0]) && master.emit('master');
			console.log('typeof master:', typeof master);
		});
	});
}();
