const socket = require('socket.io-client')('http://localhost:3000');
//const socket = io();

socket.on('connect', () => console.log('connect:'));
//socket.on('event', function(data){});
socket.on('disconnect', () => console.log('disconnect:'));

function sendMessage() {
	socket.emit('chat message', 'message');
}

setTimeout(sendMessage, 1000);
setTimeout(sendMessage, 2000);
setTimeout(sendMessage, 3000);
setTimeout(() => process.exit(), 3100);

socket.on('chat message', msg => {
	if (typeof msg === 'object') msg = JSON.stringify(msg);
	console.log('chat message:', msg);
});
socket.on('session id', sessionId => {
	console.log('session id:', sessionId);
});
//socket.on('hi', onReceiveMessage);
//socket.on('some event', onReceiveMessage);
