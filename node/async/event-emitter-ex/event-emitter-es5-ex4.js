'use strict';

const EventEmitter = require('events').EventEmitter;

function MyEventEmitter() {
	EventEmitter.call(this);
}

Object.setPrototypeOf(MyEventEmitter.prototype, EventEmitter.prototype);
MyEventEmitter.prototype.emitMyEvent = function(data) {
	this.emit('my-event', data);
};

const ev = new MyEventEmitter;
ev.on('my-event', function () { console.log('fire'); });
ev.emitMyEvent();

// http://qiita.com/SFPGMR/items/6cc911745d27cc896562
