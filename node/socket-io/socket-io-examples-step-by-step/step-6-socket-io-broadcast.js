const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
	if (req.url === '/')
		return res.writeHead(200, {'content-type': 'text/html; charset=UTF-8'}),
			fs.createReadStream('./index.html').pipe(res);

	res.writeHead(200, {'content-type': 'text/html; charset=UTF-8'});
	res.end('<h1>Hello world [' + req.url + ']</h1>');
});

const io = require('socket.io')(server);

//io.on('connection', socket => console.log('a user connected'));

// 接続
io.on('connection', function (socket) {
	console.log('a user connected');

	io.emit('some event', { for: 'everyone' });
	socket.broadcast.emit('hi', 'hi there');

	socket.on('chat message', function (msg) {
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});

	// 切断
	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
});

server.listen(3000, function() {
	console.log('listening on *:3000');
});
