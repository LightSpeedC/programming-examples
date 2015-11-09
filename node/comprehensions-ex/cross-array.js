// Array comprehensions
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Array_comprehensions

// [for (x of iterable) x]
//   cross(iterable)
//   array.cross()
//   Array.from(iterable)

// [for (x of iterable) if (condition) x]
//   cross(iterable).filter(condition)
//   array.filter(condition)

// [for (x of iterable1) for (y of iterable2) x + y]
//   cross(iterable1, iterable2, (x, y) => x + y)
//   array1.cross(iterable2, (x, y) => x + y)

(function () {
	'use strict';

	module.exports = cross;
	cross.extendPrototype = extendPrototype;

	function extendPrototype() {
		// Array.prototype.cross
		if (!Array.prototype.cross)
			Object.defineProperty(Array.prototype, 'cross',
				{value: cross, configurable: true});

		// Generator.prototype.cross
		try {
			var proto = eval('(function *(){}()).constructor.prototype');
			if (!proto.cross)
				Object.defineProperty(proto, 'cross',
					{value: cross, configurable: true});
		} catch (e) {}

		return cross; // for method chain
	}

	// cross
	function cross() {
		var args = this instanceof Array || isIterator(this) ? [this] : [];
		[].push.apply(args, arguments);

		var res = args[0];
		if (!(res instanceof Array)) res = makeArrayFromIterator(res);

		for (var n = 1; n < args.length; ++n) {
			var a = res, b = args[n], res = [];
			if (typeof b === 'function') {
				res = a.map(function(v){return b.apply(null, v instanceof Array ? v : [v])});
			}
			else {
				if (!(b instanceof Array)) b = makeArrayFromIterator(b);
				for (var i in a)
					for (var j in b)
						res.push([].concat(a[i], b[j]));
			}
		}

		return res;
	}

	// isIterator(iter)
	function isIterator(iter) {
		return !!iter && (typeof iter.next === 'function' || isIterable(iter));
	}

	// isIterable(iter)
	function isIterable(iter) {
		return !!iter && typeof Symbol === 'function' && Symbol &&
				Symbol.iterator && typeof iter[Symbol.iterator] === 'function';
	}

	// makeArrayFromIterator(iter or array)
	function makeArrayFromIterator(iter) {
		// is Array?
		if (iter instanceof Array) return iter;

		// Array.from(iter) supported?
		if (typeof Array.from === 'function') {
			try { return Array.from(iter); }
			catch (e) {}
		}

		var array = [];

		// for (val of iter) supported?
		try { eval('for (var val of iter) array.push(val);'); return array; }
		catch (e) {}

		// primitive value or normal object?
		if (!isIterator(iter)) return [iter];

		// ES6 iterator?
		if (isIterable(iter)) iter = iter[Symbol.iterator]();

		// ES6 iterator & Firefox old iterator supported
		try {
			for (;;) {
				var val = iter.next();
				if (val && val.hasOwnProperty('done') && val.done) return array;
				if (val && val.hasOwnProperty('value')) val = val.value;
				array.push(val);
			}
		} catch (error) {
			return array;
		}
	}

})();
