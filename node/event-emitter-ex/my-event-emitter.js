// EventEmitter

// http://nodejs.jp/nodejs.org_ja/api/events.html

const EventEmitter = (function () {

	// EventEmitter
	class EventEmitter {

		constructor() {
			this.reset();
		}

		// reset
		reset() {
			this.$listeners0 = Object.create(null);
			this.$listeners1 = Object.create(null);
			return this;
		}

		// addListener
		addListener(event, listener) {
			// this.emit('newListener', event, listener);
			if (!this.$listeners0) this.$listeners0 = Object.create(null);
			return addListener(this.$listeners0, event, listener), this;
		}

		// on
		on(event, listener) {
			// this.emit('newListener', event, listener);
			if (!this.$listeners0) this.$listeners0 = Object.create(null);
			return addListener(this.$listeners0, event, listener), this;
		}

		// once
		once(event, listener) {
			// this.emit('newListener', event, listener);
			if (!this.$listeners1) this.$listeners1 = Object.create(null);
			return addListener(this.$listeners1, event, listener), this;
		}

		// removeListener
		removeListener(event, listener) {
			if (!event) return this.reset();
			removeListener(this.$listeners0, event, listener);
			removeListener(this.$listeners1, event, listener);
			return this;
		}

		// removeAllListeners
		removeAllListeners(event) {
			if (!event) return this.reset();
			removeAllListeners(this.$listeners0, event);
			removeAllListeners(this.$listeners1, event);
			return this;
		}

		// off
		off(event, listener) {
			if (!event) return this.reset();
			removeListener(this.$listeners0, event, listener);
			removeListener(this.$listeners1, event, listener);
			return this;
		}

		// emit(event, ...args)
		emit(event, ...args) {
			emit(this.$listeners0, event, args);
			emit(this.$listeners1, event, args);
			if (this.$listeners1 && this.$listeners1[event])
				delete this.$listeners1[event];
			return this;
		}

		// listeners(event)
		listeners(event) {
			return (this.$listeners0 && this.$listeners0[event] || [])
				.concat(this.$listeners1 && this.$listeners1[event] || []);
		}

		// setMaxListeners(n)
		// static defaultMaxListeners
		// static listenerCount(emitter, event)

		// static mixin
		static mixin(Class) {
			Object.getOwnPropertyNames(EventEmitter.prototype)
				.filter(x => x !== 'constructor')
				.forEach(x => {
				if (Class.prototype[x]) return;
				Object.defineProperty(Class.prototype, x, {
					value: EventEmitter.prototype[x],
					writable: true, enumerable: false, configurable: true,
				});
			});
		}

		// Event: newListener
		// Event: removeListener
	}

	// addListener
	function addListener($listeners0, event, listener) {
		($listeners0[event] || ($listeners0[event] = [])).push(listener);
	}

	// removeListener
	function removeListener($listeners0, event, listener) {
		if (!$listeners0 || !$listeners0[event]) return;
		if (!listener) return delete $listeners0[event];

		$listeners0[event] = $listeners0[event].filter(fn => fn !== listener);
		if ($listeners0[event].length === 0) delete $listeners0[event]
	}

	// removeAllListeners
	function removeAllListeners($listeners0, event) {
		if (!$listeners0 || !$listeners0[event]) return;
		delete $listeners0[event];
	}

	// emit
	function emit($listeners0, event, args) {
		if ($listeners0 && $listeners0[event])
			$listeners0[event].forEach(listener => listener.apply(null, args));
	}

	alias(EventEmitter, 'clear', 'reset');
	alias(EventEmitter, 'one', 'once');
	//alias(EventEmitter, 'addListener', 'on');
	//alias(EventEmitter, 'removeListener', 'off');
	alias(EventEmitter, 'fire', 'emit');
	alias(EventEmitter, 'subscribe', 'on');
	alias(EventEmitter, 'unsubscribe', 'off');
	alias(EventEmitter, 'publish', 'emit');
	alias(EventEmitter, 'trigger', 'emit');

	// alias
	function alias(Class, x, y) {
		Object.defineProperty(Class.prototype, x, {
			value: Class.prototype[y],
			writable: true, enumerable: false, configurable: true,
		});
		// Class.prototype[x] = Class.prototype[y];
	}

	return EventEmitter;

})();

// class MyClass extends EventEmitter {};
class MyClass {};
EventEmitter.mixin(MyClass);

// var ee = new EventEmitter();
var ee = new MyClass();
ee.on('eventx', (arg1, arg2) => console.log('eventx', arg1, arg2));
ee.emit('eventx', 11, 12);
ee.emit('eventx', 21, 22);
ee.one('event1', (arg1, arg2) => console.log('event1', arg1, arg2));
ee.emit('event1', 11, 12);
ee.emit('event1', 21, 22);
ee.off('eventx');
ee.emit('eventx', 31, 32);
