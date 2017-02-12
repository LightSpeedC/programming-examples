'use strict';

const WebSocket = require('ws');
let clientNo = 0;

const EventEmitter = require('events').EventEmitter;
const ee = new EventEmitter();

const ws = new WebSocket('ws://localhost:8080/', {
	perMessageDeflate: false
});

function emit(event, msg) {
	ws.send(JSON.stringify({event: event, message: msg}));
}

ws.on('open', function open() {
	console.log(clientNo + ': ws on open');
	setTimeout(
		() => emit('message', clientNo + ': something from client'), 1000);
});

ee.on('you are', function incoming(message) {
	clientNo = message;
	console.log(clientNo + ': received: you are ' + message);
});

ee.on('message', function incoming(message) {
	console.log(clientNo + ': received: ' + message);
});

ws.on('message', function incoming(message, flags) {
	// flags.binary will be set if a binary data is received.
	// flags.masked will be set if the data was masked.

	const data = JSON.parse(message);
	ee.emit(data.event, data.message);
});

ws.on('error', err => console.log(clientNo + ': ws error: ' + err));

let interval = setInterval(
	() => emit('message', clientNo + ': something from client every 3s'), 3000);

ws.on('close', () => {
	interval && (interval = clearInterval(interval));
	console.log(clientNo + ': ws close');
});

console.log(clientNo + ': client started.');

require('control-c')
(() => process.exit());
