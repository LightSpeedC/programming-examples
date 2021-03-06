var aa = function () {
	'use strict';

	var slice = [].slice;

	return aa;

	function aa(gtor, cb) {

		var Base = this || typeof Promise === 'function' ? Promise : 'no thunk or promise';

		if (typeof gtor === 'function') gtor = gtor();

		return new Base(function (res, rej) {
			next();
			function next(err, val) {
				if (arguments.length > 2)
					val = slice.call(arguments, 1);
				else if (arguments.length === 1 && !(err instanceof Error))
					val = err, err = null;
				try { var obj = err ? gtor.throw(err) : gtor.next(val); }
				catch (err) { rej(err); }
				val = obj.value;
				if (obj.done) res(val);
				else if (!val) next(null, val);
				else if (val instanceof Error) next(val);
				else if (val.constructor === Array ||
					val.constructor === Object)
						Base.all(val).then(next, next);
						// Base.all(val, next);
				else if (typeof val === 'function') val(next);
				else if (typeof val.then === 'function') val.then(next, next);
				else next(null, val);
			} // next
		}, cb);
	} // aa
}();

if (typeof module === 'object' && module && module.exports)
	module.exports = aa;
