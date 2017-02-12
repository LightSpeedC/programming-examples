'use strict';

const WebSocket = require('ws');
let clientNo = 0;

const ws = new WebSocket('ws://localhost:8080/', {
	perMessageDeflate: false
});

ws.on('open', function open() {
	console.log(clientNo + ': ws on open');
	setTimeout(
		() => ws.send(clientNo + ': something from client'), 1000);
});

ws.on('message', function incoming(message, flags) {
	// flags.binary will be set if a binary data is received.
	// flags.masked will be set if the data was masked.
	if (message.substr(0, 8) === 'you are ')
		clientNo = message.substr(8);
	console.log(clientNo + ': received: ' + message, flags);
});

ws.on('error', err => console.log(clientNo + ': ws error: ' + err));

let interval = setInterval(
	() => ws.send(clientNo + ': something from client every 3s'), 3000);

ws.on('close', () => {
	interval && (interval = clearInterval(interval));
	console.log(clientNo + ': ws close');
});

console.log(clientNo + ': client started.');

require('control-c')
(() => process.exit());
