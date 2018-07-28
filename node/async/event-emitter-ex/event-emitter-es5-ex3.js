'use strict';

const EventEmitter = require('events').EventEmitter;

function MyEventEmitter() {
	EventEmitter.call(this);
}

MyEventEmitter.prototype = Object.create(EventEmitter.prototype, {
	emitMyEvent: {configurable: true,
		value: function(data) {
			this.emit('my-event', data);
		}
	}
});

const ev = new MyEventEmitter;
ev.on('my-event', function () { console.log('fire'); });
ev.emitMyEvent();

// http://qiita.com/SFPGMR/items/6cc911745d27cc896562
