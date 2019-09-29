'use strict';

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const CHAT_MESSAGE = 'chat message';

app.get('/', (req, res) =>
	res.sendFile(__dirname + '/index.html'));
	// res.send('<h1>Hello world</h1>')

server.listen(3000, () =>
	console.log('listening on *:3000'));

io.on('connection', socket => {
	console.log('a user connected');
	io.emit(CHAT_MESSAGE, 'for everyone');
	socket.broadcast.emit(CHAT_MESSAGE, 'hi');

	// CHAT_MESSAGE 'chat message'
	socket.on(CHAT_MESSAGE, msg => {
		console.log('message: ' + msg);
		io.emit(CHAT_MESSAGE, msg);
	});
	// disconnect
	socket.on('disconnect', () =>
		console.log('user disconnected'));
});
