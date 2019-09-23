// https://qiita.com/kenju/items/b0554846a44d369cba7b
// https://qiita.com/necojackarc/items/c77cf3b5368b9d33601b
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error

function ApplicationError(message, fileName, lineNumber) {
	var instance = new Error(message, fileName, lineNumber);
	instance.name = this.constructor.name;
	Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
	Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
	return instance;
}

ApplicationError.prototype = Object.create(Error.prototype, {
	constructor: {
		value: ApplicationError,
		enumerable: false,
		writable: true,
		configurable: true
	},
});
Object.setPrototypeOf(ApplicationError, Error);

var InputError = ApplicationError;
// class InputError extends ApplicationError {}

function errorsOnThree(input) {
	if (input === 3) {
		throw new InputError('Three is not allowed');
	}
	return input;
}

console.log(new InputError('Three is not allowed') + '');
console.log(new InputError('Three is not allowed'));
errorsOnThree(3);
