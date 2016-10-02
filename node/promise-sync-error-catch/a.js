const parseJson = (json) => {
	return new Promise((resolve, reject) => {
		try {
			resolve(JSON.parse(json));
		} catch (e) {
			reject(e);
		}
	});
}
parseJson('[1,2,3,4]').then(val => console.log(val)); // [1,2,3]
parseJson('[1,2,3,4').catch(e => console.error(e)); // SyntaxError: JSON.parse: end of data when ',' or ']' was expected
