	console.log('Object.prototype.watch:  ', Object.prototype.watch);
	console.log('Object.prototype.unwatch:', Object.prototype.unwatch);

	void function (proto, obj) {
		for (var prop in obj)
			proto[prop] ||
			Object.defineProperty(proto, prop, {
				configurable: true,
				writable: true,
				value: obj[prop]});
	} (Object.prototype, {
		watch: function watch(prop, handler) {
			if (typeof handler !== 'function')
				throw new TypeError('handler must be a function');

			var desc = Object.getOwnPropertyDescriptor(this, prop);
			if (!desc)
				throw new Error('property "' + prop + '" can not watch! not exist!');
			if (!desc.configurable)
				throw new Error('property "' + prop + '" can not watch! not configurable!');

			var watched = {};
			Object.defineProperty(watched, 'value', desc);

			desc = {
				configurable: desc.configurable,
				enumerable: desc.enumerable,
				get: function () { return watched.value; },
				set: function (newVal) {
					return watched.value = handler.call(this, prop, watched.value, newVal);
				}
			};
			desc.get.watched = watched; // save descriptor in hidden property of getter function. :-)

			Object.defineProperty(this, prop, desc);
			// else throw new Error('property "' + prop + '" can not watch!');
		},
		unwatch: function unwatch(prop) {
			var desc = Object.getOwnPropertyDescriptor(this, prop);
			if (!desc || !desc.get || !desc.get.watched)
				throw new Error('property "' + prop + '" can not unwatch! not watched!');

			desc = Object.getOwnPropertyDescriptor(desc.get.watched, 'value');
			if (!desc)
				throw new Error('property "' + prop + '" can not unwatch! not watched!');
			Object.defineProperty(this, prop, desc);
		},
		isWatched: function isWatched(prop) {
			var desc = Object.getOwnPropertyDescriptor(this, prop);
			if (!desc || !desc.get || !desc.get.watched) return false;

			return !!Object.getOwnPropertyDescriptor(desc.get.watched, 'value');
		}
	});

var obj = {ww:0, x:1, y:2, zz:4};
console.log(json(obj), obj.x, obj.y);
obj.watch('x', handler);
obj.watch('y', handler);
console.log(json(obj), obj.x, obj.y);
obj.x = 11;
obj.y = 22;
console.log(json(obj), obj.x, obj.y);
obj.x = 111;
obj.y = 222;
console.log(json(obj), obj.x, obj.y);
obj.unwatch('x');
obj.unwatch('y');
obj.x = 111;
obj.y = 222;
console.log(json(obj), obj.x, obj.y);

try { obj.watch('z'); } catch (e) { console.log(e + ''); }
try { obj.watch('z', handler); } catch (e) { console.log(e + ''); }
try { obj.unwatch('x'); } catch (e) { console.log(e + ''); }
try { obj.unwatch('y'); } catch (e) { console.log(e + ''); }
try { obj.unwatch('z'); } catch (e) { console.log(e + ''); }

obj.watch('x', handler);
obj.watch('x', handler);
obj.watch('x', handler);
obj.x = 1;
obj.unwatch('x');
obj.unwatch('x');
obj.unwatch('x');
try { obj.unwatch('x'); } catch (e) { console.log(e + ''); }

function handler(prop, oldVal, newVal) {
	console.log('handler(', prop, ',', oldVal, ',', newVal, ')', newVal > 100 ? ' OUT OF RANGE!' : '');
	return newVal > 100 ? oldVal : newVal;
}

function json(obj) {
	return JSON.stringify(obj).replace(/\"/g, '');
}

for (var i in obj)
	console.log(i);

console.log(Object.keys(obj));

// Mozilla Polyfill
// https://gist.github.com/eligrey/384583
