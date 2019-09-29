// https://qiita.com/kenju/items/b0554846a44d369cba7b
// https://qiita.com/necojackarc/items/c77cf3b5368b9d33601b
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error

class ApplicationError extends Error {
	constructor(...args) {
		super(...args);
		this.name = this.constructor.name;
		Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
	}

	// toString() {
	//	return this.constructor.name + ': ' + this.message;
	// }
}

class InputError extends ApplicationError {}

function errorsOnThree(input) {
	if (input === 3) {
		throw new InputError('Three is not allowed');
	}
	return input;
}

console.log(new InputError('Three is not allowed') + '');
console.log(new InputError('Three is not allowed'));
errorsOnThree(3);
