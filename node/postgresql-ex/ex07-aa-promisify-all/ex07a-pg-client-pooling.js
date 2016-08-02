(function () {
	'use strict';

	const pg = require('pg');
	const aa = require('aa');

	aa.promisifyAll(pg.constructor.prototype, {suffix: 'A'});
	aa.promisifyAll(pg.Client.prototype, {suffix: 'A'});

	// Client pooling

	const host = process.env.PGHOST     || 'localhost';
	const port = process.env.PGPORT     || '5432';
	const db   = process.env.PGDATABASE || 'postgres';
	const user = process.env.PGUSER     || 'postgres';
	const pw   = process.env.PGPASSWORD || 'password';

	const conString = 'postgres://' + user + ':' + pw + '@' + host + '/' + db;

	aa(function *() {
		try {
			let msg = 'error fetching client from pool';

			const [client, done] = yield pg.connectA(conString);
			console.log('connected!!!');

			msg = 'error running query';
			var result = yield client.queryA('select $1::int as number', ['1'])

			//call `done()` to release the client back to the pool
			done();

			//console.log(result.rows[0]);
			console.log(result);

			console.log('end');

		}
		catch (err) {
			return console.error(msg, err);
		}

		pg.end();
	});
})();
