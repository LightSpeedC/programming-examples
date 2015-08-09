// Date.now polyfill for IE8
if (!Date.now) Date.now = function now() { return new Date() - 0; };

// [].reduce polyfill for IE8
if (!Array.prototype.reduce)
	Array.prototype.reduce = function reduce(f) {
		var a = this[0];
		if (this.length <= 1) return a;
		for (var i = 1, n = this.length; i < n; ++i)
			a = f(this[i], a, i, this);
		return a;
	};

// [].filter polyfill for IE8
if (!Array.prototype.filter)
	Array.prototype.filter = function filter(f) {
		var a = [];
		for (var i = 0, n = this.length; i < n; ++i)
			if (f(this[i], a, i, this))
				a.push(this[i]);
		return a;
	};
