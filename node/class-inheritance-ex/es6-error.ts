class ApplicationError implements Error {
	public name = 'ApplicationError';

	constructor(public message: string) {
	}

	toString() {
		return this.name + ': ' + this.message;
	}
}

class InputError extends ApplicationError {
}

function errorsOnThree(input: number) {
	if (input === 3) {
		throw new InputError('Three is not allowed');
	}
	return input;
}
