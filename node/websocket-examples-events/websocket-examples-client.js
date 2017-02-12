'use strict';

const WebSocket = require('ws');
let clientNo = 0;

const EventEmitter = require('events').EventEmitter;
const ee = new EventEmitter();

const ws = new WebSocket('ws://localhost:8080/', {
	perMessageDeflate: false
});

ws.on('open', function open() {
	console.log(clientNo + ': ws on open');
	setTimeout(
		() => emit('message', clientNo + ': something from client'), 1000);
});

ee.on('you are', function (message) {
	clientNo = message;
	console.log(clientNo + ': you are: ' + message);
});

ee.on('message', function (message) {
	console.log(clientNo + ': message: ' + message);
});

ws.on('message', function (message, flags) {
	// flags.binary will be set if a binary data is received.
	// flags.masked will be set if the data was masked.

	const data = JSON.parse(message);
	ee.emit(data.event, data.message);
});

ws.on('error', err => console.log(clientNo + ': ws error: ' + err));

let interval = setInterval(function () {
	emit('message', clientNo + ': something from client every 3s');
	rpc('add', {x:2, y:3}).then(res => console.log(res));
}, 3000);

ws.on('close', () => {
	interval && (interval = clearInterval(interval));
	console.log(clientNo + ': ws close');
});

function emit(event, msg) {
	ws.send(JSON.stringify({event: event, message: msg}));
}

let rpcSeq = 0;
function rpc(method, params) {
	const id = clientNo + '.' + (++rpcSeq);
	return new Promise(function (resolve, reject) {
		emit('rpc-req', {id: id, method: method, params: params});
		ee.once('rpc-res-' + id, resolve);
	});
}

ee.on('rpc-res', message => ee.emit('rpc-res-' + message.id, message));

console.log(clientNo + ': client started.');

require('control-c')
(() => process.exit());
