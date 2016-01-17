for (var i = 1; i < 16; ++i) {
	if (i % 3 === 0)
		if (i % 5 === 0)
			y = 'FizzBuzz';
		else
			y = 'Fizz';
	else
		if (i % 5 === 0)
			y = 'Buzz';
		else
			y = i;

	x = i % 3 ? '' : 'Fizz'
	x = i % 5 ? x : x + 'Buzz'
	x = x || i;
	console.log(x);

	if (x !== y) throw new Error('eh!?');
}
