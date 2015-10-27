(function () {
	'use strict';

	var pg = require('pg');
	var aa = require('aa'), thunkify = aa.thunkify, Channel = aa.Channel;

	// Client pooling

	//var conString = 'postgres://postgres:1234@localhost/postgres';
	var conString = 'postgres://myami_common:myami_common@localhost/myami';
	pg.connectA = thunkify.call(pg, pg.connect);

	aa(function *() {
		try {
			var msg = 'error fetching client from pool';

			var result = yield pg.connectA(conString);
			var client = result[0], done = result[1];

			console.log('connected!!!');

			msg = 'error running query';
			client.queryA = thunkify.call(client, client.query)

			//client_query('SELECT $1::int AS numbor', ['1'])
			var result = yield client.queryA('select * from s_tenant_r', []);

			//call `done()` to release the client back to the pool
			done();

			//console.log(result.rows[0]);
			console.log(result);

			console.log('end');

		}
		catch (err) {
			return console.error(msg, err);
		}

		process.exit();
	});
})();
