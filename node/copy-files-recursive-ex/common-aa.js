'use strict';

module.exports = function (Base) {

	Base.aa || (Base.aa = aa);

	var slice = [].slice;

	function aa(gtor, cb) {
		if (typeof gtor === 'function') gtor = gtor();
		return Base(function (res, rej) {
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
				else if (typeof val === 'function') val(next);
				else if (typeof val.then === 'function') val.then(next, next);
				else next(null, val);
			} // next
		}, cb);
	} // aa

	return Base;
};
