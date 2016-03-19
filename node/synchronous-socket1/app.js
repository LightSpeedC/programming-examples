void function () {
	'use strict';
	var port = process.argv[2] || process.env.PORT || 3000;
	console.log('port:', port);

	var fs = require('fs');
	var http = require('http');
	var app = http.createServer(function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream('index.html').pipe(res)
	});

	var io = require('socket.io')(app);
	app.listen(port);

	var master = null;
	var conns = [];

	io.on('connection', socket => {
		conns.push(socket);
		console.log('connection', master != null);

		// masterが存在しなければ、コネクション成立したものをmasterにする
		if (!master) {
			master = socket;
			socket.emit('master');
		}
		// master以外の接続の場合masterに位置情報を送信を依頼
		else if (master !== socket)
			master.emit('up');

		// masterからの位置情報が来れば全員に知らせる
		socket.on('move', data => {
			//console.log('move', data);

			data.onlineCount = conns.length;

			//運動状態を送信
			if (master === socket)
				io.emit('move', data);
		});

		// 切断時
		socket.on('disconnect', () => {
			console.log('disconnect', conns.length, '->', conns.length - 1);
			conns = conns.filter(s => s !== socket);
			// masterが死んだら誰かを新しくmasterに昇格させる
			if (socket === master)
				(master = conns[0]) && master.emit('master');
		});
	});
}();
