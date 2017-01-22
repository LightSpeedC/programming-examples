class EventEmitter {
	constructor() {
		this.events = {};
		this.eventsOnce = {};
	}
	emit(event, ...args) {
		if (this.events[event])
			this.events[event].forEach(listener => listener.apply(null, args));

		if (this.eventsOnce[event]) {
			this.eventsOnce[event].forEach(listener => listener.apply(null, args));
			delete this.eventsOnce[event];
		}

		return this;
	}
	on(event, listener) {
		if (!this.events[event]) this.events[event] = [];
		this.events[event].push(listener);
		return this;
	}
	once(event, listener) {
		if (!this.eventsOnce[event]) this.eventsOnce[event] = [];
		this.eventsOnce[event].push(listener);
		return this;
	}
	off(event, listener) {
		if (this.events[event])
			this.events[event] = this.events[event].filter(handler => handler !== listener);

		if (this.eventsOnce[event])
			this.eventsOnce[event] = this.eventsOnce[event].filter(handler => handler !== listener);

		return this;
	}
}
EventEmitter.prototype.addEventListener = EventEmitter.prototype.on;
EventEmitter.prototype.removeEventListener = EventEmitter.prototype.off;
