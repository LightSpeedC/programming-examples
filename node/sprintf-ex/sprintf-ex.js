	// var util = require('util');

	var form = {s: String, d: Number, j: JSON.stringify};

	function ins(str) {
		// return typeof str === 'string' ? str : util.inspect(str);
		return typeof str === 'string' ? str : inspect(str);
	}

	function inspect(obj) {
		if (obj == null || typeof obj !== 'object') return String(obj);
		if (obj.constructor === Array) {
			var str = '[';
			if (obj.length) str += inspect(obj[0]);
			for (var i = 1, n = obj.length; i < n; ++i)
				str += ', ' + inspect(obj[i]);
			return str + ']';
		}
		if (obj.constructor === Object) {
			var str = '{', keys = Object.keys(obj);
			if (keys.length) str += inspect(obj[keys[0]]);
			for (var i = 1, n = obj.length; i < n; ++i)
				str += ', ' + inspect(obj[keys[i]]);
			return str + '}';
		}
		if (obj.constructor === RegExp) return obj.toString();
		if (obj instanceof Error) return '[' + obj.toString() + ']';

		var str = '{', keys = Object.keys(obj);
		if (keys.length) str += inspect(obj[keys[0]]);
		for (var i = 1, n = obj.length; i < n; ++i)
			str += ', ' + inspect(obj[keys[i]]);
		return str + '}';
	}

	function sprintf(format) {
		// return util.format.apply(this, arguments);
		if (arguments.length === 1) return ins(format);
		var i = 1, args = arguments;
		var str = typeof format !== 'string' ? ins(format) :
		format.replace(/%((%)|s|d|j)/g, function (match, p1, p2) {
			return p2 || (i < args.length ? form[p1](args[i++]) : match);
		});
		while (i < arguments.length) str += ' ' + ins(arguments[i++]);
		return str;
	}

	console.log(sprintf('%% %s %d') + '!');
	console.log('%% %s %d');
	console.log();

	console.log(sprintf('%% %s %d', 11) + '!');
	console.log('%% %s %d', 11);
	console.log();

	console.log(sprintf('%% %s %d', 11, 22, 33, 44) + '!');
	console.log('%% %s %d', 11, 22, 33, 44);
	console.log();

	console.log(sprintf('%% %s %d', false) + '!');
	console.log('%% %s %d', false);
	console.log();

	console.log(sprintf('%% %s %d', 11, false) + '!');
	console.log('%% %s %d', 11, false);
	console.log();

	console.log(sprintf('%% %s %d', '') + '!');
	console.log('%% %s %d', '');
	console.log();

	console.log(sprintf('%% %s %d', 11, '') + '!');
	console.log('%% %s %d', 11, '');
	console.log();

	console.log(sprintf('%% %s %d', undefined) + '!');
	console.log('%% %s %d', undefined);
	console.log();

	console.log(sprintf('%% %s %d', 11, undefined) + '!');
	console.log('%% %s %d', 11, undefined);
	console.log();

	console.log(sprintf('%% %j', {x:1,y:'2'}) + '!');
	console.log('%% %j', {x:1,y:'2'});
	console.log();

	console.log(sprintf('%% %j', {x:1,y:'2'}, {x:1,y:'2'}) + '!');
	console.log('%% %j', {x:1,y:'2'}, {x:1,y:'2'});
	console.log();

	console.log(sprintf('%% %j', {x:1,y:'2'}, 11, true, 'aa') + '!');
	console.log('%% %j', {x:1,y:'2'}, 11, true, 'aa');
	console.log();

	console.log(sprintf('%% %j', new Error('a'), new Error('a')) + '!');
	console.log('%% %j', new Error('a'), new Error('a'));
	console.log();

	console.log(sprintf(new Error('a %s eh?'), new Error('a')) + '!');
	console.log(new Error('a %s eh?'), new Error('a'));
	console.log();

	console.log(sprintf('%% %j %j', [], {}, [], {}) + '!');
	console.log('%% %j %j', [], {}, [], {});
	console.log();

	console.log(sprintf('%% %s %j', /x/, /x/, /x/) + '!');
	console.log('%% %s %j', /x/, /x/, /x/);
	console.log();
