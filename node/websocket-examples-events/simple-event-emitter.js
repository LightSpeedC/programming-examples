// EventEmitter
function EventEmitter() {
	this.listeners0 = {};
	this.listeners1 = {};
}

// on
EventEmitter.prototype.on = function on(event, listener) {
	(this.listeners0[event] || (this.listeners0[event] = [])).push(listener);
};

// once
EventEmitter.prototype.once = function once(event, listener) {
	(this.listeners1[event] || (this.listeners1[event] = [])).push(listener);
};

// emit
EventEmitter.prototype.emit = function emit(event) {
	var args = [].slice.call(arguments, 1);

	for (var i in this.listeners0[event])
		this.listeners0[event][i].apply(null, args);
	for (var i in this.listeners1[event])
		this.listeners1[event][i].apply(null, args);
	delete this.listeners1[event];

/*
	if (this.listeners0[event])
		this.listeners0[event].forEach(function (x) {
			x.apply(null, args);
		});
	if (this.listeners1[event]) {
		this.listeners1[event].forEach(function (x) {
			x.apply(null, args);
		});
		delete this.listeners1[event];
	}
*/
};

if (typeof module === 'object' && module && module.exports)
	module.exports = EventEmitter;
