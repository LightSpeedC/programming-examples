	console.log('Object.prototype.watch:  ', Object.prototype.watch);
	console.log('Object.prototype.unwatch:', Object.prototype.unwatch);

	void function (proto, obj) {
		for (var prop in obj)
			proto[prop] ||
			Object.defineProperty(proto, prop, {
				configureable: true,
				writable: true,
				value: obj[prop]});
	} (Object.prototype, {
		watch: function watch(prop, handler) {
			var val = this[prop];
			if (typeof handler !== 'function')
				throw new TypeError('handler must be a function');

			delete this[prop];
			Object.defineProperty(this, prop, {
				configureable: true,
				enumerable: true,
				get: function () { return val; },
				set: function (newVal) {
					var oldVal = val;
					val = newVal;
					handler.call(this, prop, oldVal, newVal);
				}
			});
		},
		unwatch: function unwatch(prop) {
			var val = this[prop];

			delete this[prop];
			this[prop] = val;
		}
	});

var obj = {x:1, y:2};
console.log(json(obj), obj.x, obj.y);
obj.watch('x', handler);
obj.watch('y', handler);
console.log(json(obj), obj.x, obj.y);
obj.x = 11;
obj.y = 22;
console.log(json(obj), obj.x, obj.y);

function handler(prop, oldVal, newVal) {
	console.log('handler(', prop, ',', oldVal, ',', newVal, ')');
}

function json(obj) {
	return JSON.stringify(obj).replace(/\"/g, '');
}

for (var i in obj)
	console.log(i);

console.log(Object.keys(obj));
