(function () {
	'use strict';

	const pg = require('pg');
	const aa = require('aa');

	aa.thunkifyAll(pg.constructor.prototype, {suffix: 'A'});
	aa.thunkifyAll(pg.Client.prototype, {suffix: 'A'});

	// Client instance

	const host = process.env.PGHOST     || 'localhost';
	const port = process.env.PGPORT     || '5432';
	const db   = process.env.PGDATABASE || 'postgres';
	const user = process.env.PGUSER     || 'postgres';
	const pw   = process.env.PGPASSWORD || 'password';

	const conString = 'postgres://' + user + ':' + pw + '@' + host + '/' + db;

	aa(function *() {

		let client = new pg.Client(conString);

		try {
			let msg = 'could not connect to postgres';
			yield client.connectA();
			console.log('connected!!!');

			msg = 'error running query';
			const result = yield client.queryA('select $1::int as number', ['1']);
			console.log(result); // result.rows[0]

			client.end();
		}
		catch (err) {
			return console.error(msg, err);
		}

		yield aa.wait(100);

		client = new pg.Client(conString);

		yield client.connectA();
		console.log('connected!!! 2nd.');
		const result = yield client.queryA('select $1::int as number', ['1']);
		console.log(result);
		client.end();
		yield aa.wait(100);
	});
})();
