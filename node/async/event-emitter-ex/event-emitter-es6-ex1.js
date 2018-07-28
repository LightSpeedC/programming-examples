'use strict';

const EventEmitter = require('events').EventEmitter;

class MyEventEmitter extends EventEmitter
{
	// 省略可
	constructor() {
		super();
	}

	emitMyEvent(data) {
		this.emit('my-event', data);
	}
}

const ev = new MyEventEmitter;
ev.on('my-event', function () { console.log('fire'); });
ev.emitMyEvent();

// http://qiita.com/SFPGMR/items/6cc911745d27cc896562
