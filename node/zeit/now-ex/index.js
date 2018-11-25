'use strict';

const dt0 = new Date();

module.exports = (req, res) => {
	const dt = new Date();
	console.log(dt.toLocaleDateString(), dt.toLocaleTimeString(), req.method, req.url);
	res.end('hello! 2018-11-25 23:58 - ' +
		'load ' + dt0.toLocaleDateString() + ' ' + dt0.toLocaleTimeString() + ' - ' +
		'req ' + dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString());
}
