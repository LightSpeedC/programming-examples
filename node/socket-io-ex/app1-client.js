void function () {
	'use strict';

	var targetUrl = process.argv[2] || 'http://localhost:3000';

	// time 時刻
	var tm = () => new Date().toLocaleTimeString();
	var time = 500;

	var io = require('socket.io-client');
	var socket = io(targetUrl);
	socket.on('news', function (msg) {
		console.log(tm(), msg);
		msg = {my:'other', tm:tm()};
		console.log(tm(), msg);
		socket.emit('my other event', msg);
	});
	setTimeout(function timer() {
		time *= 2;
		if (time >= 60000) time = 60000;
		setTimeout(timer, time);

		var msg = {my:'timer', tm:tm(), bf:new Buffer('abc')};
		console.log(tm(), msg);
		socket.emit('my timer event', msg);
		socket.emit('my timer event', {bf:new Buffer('abc')});
	}, time);
}();
