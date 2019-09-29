'use strict';

const WebSocket = require('ws');

const wss = new WebSocket.Server({
	perMessageDeflate: false,
	port: 8080
});

let clientSeq = 0;

wss.on('connection', function connection(ws) {
	const clientNo = (++clientSeq) + '';
	let interval = setInterval(
		() => ws.send(clientNo + ': something from server every 5s'), 5000)

	ws.send('you are ' + clientNo);
	console.log(clientNo + ': wss on connection');

	ws.on('message', function incoming(message) {
		console.log(clientNo + ': received: ' + message);
	});

	setTimeout(() => ws.send(clientNo + ': something from server 0.2s'), 200);
	setTimeout(() => ws.send(clientNo + ': something from server 0.4s'), 400);
	// string, Buffer, ArrayBuffer, Array, or array-like object.

	ws.on('error', function error(err) {
		interval && (interval = clearInterval(interval));
		console.log(clientNo + ': ws error: ' + err);
	});
	ws.on('close', function close() {
		interval && (interval = clearInterval(interval));
		console.log(clientNo + ': ws close');
	});

});

console.log('server started.');

require('control-c')
(() => process.exit());
