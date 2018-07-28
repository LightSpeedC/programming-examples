function getA(params, cb) {
	setTimeout(function () {
		// console.log('data:' + params);
		cb(null, 'data:' + params);
	}, 1000);
}

getA('aaa', (err, data) => {
	console.log(err, data);
	getA('bbb', (err, data2) => {
		console.log(err, data2);
		getA('ccc', (err, data3) => {
			console.log(err, data3);
			console.log(data, data2, data3);
		});
	});
});

console.log('start');
