const parseJson = json =>
	new Promise(resolve =>
		resolve(JSON.parse(json)));

parseJson('[1,2,3,4]').then(val => console.log(val)); // [1,2,3]
parseJson('[1,2,3,4').catch(e => console.error(e)); // SyntaxError: JSON.parse: end of data when ',' or ']' was expected
