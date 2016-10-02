const validators = {
	id: (id) => Number.isInteger(id) && id > 0,
	name: (name) => typeof name === string || name instanceof String,
	date: (date) => moment(date).isValid()
}

const validate = (object) => {
	return new Promise((resolve, reject) => {
		for (let key of Object.keys(validators)) {
			if (validators[key](input[key]) === false) {
				reject(key);
			}
			resolve(object);
		});
	});
}

validate(object).then(object => {
	// do something (ex. inserting to db)
});
