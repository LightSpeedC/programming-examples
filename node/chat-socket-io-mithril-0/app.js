(function () {
	'use strict';
	var port = process.argv[2] || process.env.PORT || 3000;
	console.log('port:', port);

	var fs = require('fs');
	var http = require('http');
	var app = http.createServer(function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream('index.html').pipe(res)
	});

	var io = require('socket.io')(app);
	app.listen(port);

	var msgs = [];
	addMsg({key: new Date - 0, text: 'server up: ' + new Date});

	function addMsg(msg) {
		msgs.push(msg);
		if (msgs.length > 20) msgs.shift();
		return msg;
	}

	io.on('connection', function(socket) {
		socket.emit('all', msgs);
		socket.on('msg', function(text) {
			io.emit('msg', addMsg({key: new Date - 0, text: text}));
		});
	});
})();
