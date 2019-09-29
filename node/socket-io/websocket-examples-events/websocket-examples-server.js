'use strict';

const WebSocket = require('ws');
const EventEmitter = require('events').EventEmitter;

const wss = new WebSocket.Server({
	perMessageDeflate: false,
	port: 8080
});

let clientSeq = 0;

wss.on('connection', function connection(ws) {
	const ee = new EventEmitter();
	const clientNo = (++clientSeq) + '';

	function emit(event, msg) {
		ws.send(JSON.stringify({event: event, message: msg}));
	}

	let interval = setInterval(
		() => emit('message', clientNo + ': something from server every 5s'), 5000)

	emit('you are', clientNo);
	console.log(clientNo + ': wss on connection');

	ee.on('message', function (message) {
		console.log(clientNo + ': message: ' + message);
	});

	ee.on('rpc-req', function (message) {
		console.log(clientNo + ': rpc-req: ' + JSON.stringify(message));
		ee.emit('rpc-req-' + message.method, message);
	});

	ee.on('rpc-req-add', function (message) {
		emit('rpc-res',
			{id: message.id, result: message.params.x + message.params.y});
	});

	ws.on('message', function (message) {
		//try { console.log(JSON.parse(message)); } catch (e) {}
		const data = JSON.parse(message);
		ee.emit(data.event, data.message);
		//console.log(clientNo + ': received: ' + message);
	});

	setTimeout(() => emit('message', clientNo + ': something from server 0.2s'), 200);
	setTimeout(() => emit('message', clientNo + ': something from server 0.4s'), 400);

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
