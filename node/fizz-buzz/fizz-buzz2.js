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

	x = ''
	if (i % 3 === 0) x += 'Fizz'
	if (i % 5 === 0) x += 'Buzz'
	x = x || i;
	console.log(x);

	if (x !== y) throw new Error('eh!?');
}
