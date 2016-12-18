(function immediate() {

//Firefox
//[fileName, lineNumber, columnNumber, message, name, toSource, toString, stack, constructor]
//[fileName, lineNumber, columnNumber, message]

//Chrome, Node
//[name, message, constructor, toString]
//[stack, message]

//IE11
//[constructor, name, message, toString]
//[description, message]

//Edge
//[constructor, name, message, toString]
//[description, message, stack]

	//var ownProtoProps = (Object.getOwnPropertyNames || Object.keys)((new Error('message')).constructor.prototype);
	//console.log(ownProtoProps);
	var ownProps = (Object.getOwnPropertyNames || Object.keys)((new Error('message')));
	//console.log(ownProps);
	//process.exit();

	//======================================================================
	// setValue
	var setValue = Object.defineProperty ?
		function setValue(obj, prop, val) {
			Object.defineProperty(obj, prop, {
				configurable: true,
				value: val
			});
		} :
		function setValue(obj, prop, val) {
			obj[prop] = val;
		};

	//======================================================================
	// inherits
	var inherits = Object.setPrototypeOf ?
		function inherits(ctor, superCtor) {
			setValue(ctor, 'super_', superCtor);
			Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
		} :
		function inherits(ctor, superCtor) {
			setValue(ctor, 'super_', superCtor);
			function Dummy() { setValue(this, 'constructor', ctor); }
			Dummy.prototype = superCtor.prototype;
			ctor.prototype = new Dummy();
		};

	//======================================================================
	// Error.captureStackTrace : Chrome, Node.js, v8
	var captureStackTrace = Error.captureStackTrace ||
		function captureStackTrace(obj, ctor) {
			// Firefox, Edge, IE
			var stacks = (obj.stack || callers(obj.message)).split('\n');

			var i = Number(stacks[0] === 'Error' ||
				stacks[0] === 'Error: ' + obj.message);

			if (i) stacks[0] = obj + '';
			stacks.splice(i, 1);

			setValue(obj, 'stack', stacks.join('\n'));
		};

	//======================================================================
	// Function.prototype.name for IE
	var funcNameRegExp = /^\s*function\s*\**\s*([^\(\s]*)[\S\s]+$/im;
	// funcName: get function name
	function funcName() {
		return (this + '').replace(funcNameRegExp, '$1');
	}
	if (!Function.prototype.hasOwnProperty('name')) {
		if (Object.defineProperty)
			Object.defineProperty(Function.prototype, 'name', {get: funcName});
		else if (Object.prototype.__defineGetter__)
			Function.prototype.__defineGetter__('name', funcName);
	}

	//======================================================================
	// callers
	function callers(message) {
		var stack = message ? 'Error: ' + message : 'Error';
		var fns = [], fn = callers.caller;
		while (fn) {
			if (fns.indexOf(fn) >= 0) break;
			fns.push(fn);
			stack += '\n    at ' + (fn.name || '<anonymous>');
			fn = fn.caller;
		}
		return stack;
	}

	//======================================================================
	// CustomError
	function CustomError(message) {
		if (!(this instanceof CustomError))
			return new CustomError(message);

		var err = message && new Error(message) || new Error();
		for (var i in ownProps)
			this.hasOwnProperty(ownProps[i]) ||
			err.hasOwnProperty(ownProps[i]) &&
			setValue(this, ownProps[i], err[ownProps[i]]);

		this.stack || setValue(this, 'stack', callers(message));
		captureStackTrace(this, this.constructor);
	}
	inherits(CustomError, Error);
	setValue(CustomError.prototype, 'name', CustomError.name);

	setValue(CustomError, 'extend', function extend(name) {
		var ctor = Function('super_', 'setValue', 'callers',
			'return function ' + name + '(message) {\n' +
			'	if (!(this instanceof ' + name + '))\n' +
			'		return new ' + name + '(message);\n' +
			'	this.stack || setValue(this, \'stack\',\n' +
			'		new Error(message).stack || callers(message));\n' +
			'	super_.call(this, message);\n' +
			'}')(this, setValue, callers);
		inherits(ctor, this);
		setValue(ctor.prototype, 'name', ctor.name || name);
		setValue(ctor, 'extend', extend);
		return ctor;
	});

	//======================================================================
	// ChildCustomError
	var ChildCustomError = CustomError.extend('ChildCustomError');

	//======================================================================
	// GrandchildCustomError
	var GrandchildCustomError = ChildCustomError.extend('GrandchildCustomError');

	//======================================================================
	prErr(new Error());
	prErr(new Error('error-message'));
	prErr(new TypeError());
	prErr(new TypeError('type-error-message'));
	prErr(new RangeError());
	prErr(new RangeError('range-error-message'));
	prErr(new CustomError());
	prErr(new CustomError('custom-error-message'));
	prErr(new ChildCustomError());
	prErr(new ChildCustomError('child-custom-error-message'));
	prErr(new GrandchildCustomError());
	prErr(new GrandchildCustomError('grandchild-custom-error-message'));

	function prErr(err) {
		console.log('\n======================================================================\n' + err);
		if (err.name !== err.constructor.name) console.log('!(err.name !== err.constructor.name) !!!');
		if (!(err instanceof Error)) console.log('!(err instanceof Error) !!!');
		console.log('----------------------------------------------------------------------\n' +
			'err.stack=\n' + err.stack);
		console.log('----------------------------------------------------------------------')
		console.log(err);
		console.log('----------------------------------------------------------------------')
	}
}) ();
