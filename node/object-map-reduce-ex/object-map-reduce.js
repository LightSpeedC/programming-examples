	void function (proto, obj) {
		for (var prop in obj)
			proto[prop] ||
			Object.defineProperty(proto, prop, {
				configurable: true,
				writable: true,
				value: obj[prop]});
	} (Object.prototype, {
		forEach: function forEach(fn) {
			for (var prop in this)
				if (this.hasOwnProperty(prop))
					fn(this[prop], prop, this);
		},
		map: function map(fn) {
			var obj = {};
			for (var prop in this)
				if (this.hasOwnProperty(prop))
					obj[prop] = fn(this[prop], prop, this);
			return obj;
		},
		filter: function filter(fn) {
			var obj = {};
			for (var prop in this)
				if (this.hasOwnProperty(prop))
					if (fn(this[prop], prop, this))
						obj[prop] = this[prop];
			return obj;
		},
		reduce: function reduce(fn, init) {
			var first = true;
			for (var prop in this)
				if (this.hasOwnProperty(prop))
					first && arguments.length <= 1 ?
					init = this[prop]:
					init = fn(init, this[prop], prop, this),
					first = false;
			return init;
		},
		reduceRight: function reduceRight(fn, init) {
			var first = true, self = this, len = arguments.length;
			Object.keys(this).reverse().forEach(function (prop) {
				if (self.hasOwnProperty(prop))
					first && len <= 1 ?
					init = self[prop]:
					init = fn(init, self[prop], prop, self),
					first = false;
			});
			return init;
		}
	});

	console.log({x:1,y:2,z:3}.reduce((x,y) => x + y));
	console.log({x:1,y:2,z:3}.reduce((x,y) => x + y, 1));
	console.log({x:1,y:2,z:3}.reduceRight((x,y) => x + y));
	console.log({x:1,y:2,z:3}.reduceRight((x,y) => x + y, 1));
	console.log(Object.keys({x:1,y:2,z:3}));
