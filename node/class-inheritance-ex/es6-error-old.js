class ApplicationError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ApplicationError';
	}

	toString() {
		return this.name + ': ' + this.message;
	}
}

class InputError extends ApplicationError {
}

function errorsOnThree(input) {
	if (input === 3) {
		throw new InputError('Three is not allowed');
	}
	return input;
}

errorsOnThree(3);
