(function () {
	'use strict';

	var pg = require('pg');
	var aa = require('aa'), Channel = aa.Channel;

	aa.thunkify(pg, 'connect', {suffix: 'A'});
	aa.thunkify(pg.Client.prototype, 'query', {suffix: 'A'});

	// Client pooling

	var host = process.env.PGHOST     || 'localhost';
	var port = process.env.PGPORT     || '5432';
	var db   = process.env.PGDATABASE || 'postgres';
	var user = process.env.PGUSER     || 'postgres';
	var pw   = process.env.PGPASSWORD || 'password';

	var conString = 'postgres://' + user + ':' + pw + '@' + host + '/' + db;

	//this starts initializes a connection pool
	//it will keep idle connections open for a (configurable) 30 seconds
	//and set a limit of 20 (also configurable)
	aa(function *() {
		try {
			var msg = 'error fetching client from pool';

			var result = yield pg.connectA(conString);
			var client = result[0], done = result[1];

			console.log('connected!!!');

			msg = 'error running query';

			//var query = client.query('SELECT $1::int AS num', ['1']);
			var query = client.query('select * from s_tenant_r');

			var chan = Channel(), results, row, result;

			//query.on('row', chan); // cb(row, result)
			query.on('row', (row, result) => chan({row, result}));
			query.on('error', chan); // cb(err)
			query.on('end', (res) => (result = res, chan())); // cb(res)

			while (results = yield chan) {
				//row = results[0], result = results[1];
				//row = results.row, result = results.result;

				console.log('row:', results.row);
				//output: {num: 1}

				//console.log('result:', results.result);
			}
			console.log('rowCount:', result && result.rowCount);
		}
		catch (err) {
			console.error(msg, err);
		}

		//call `done()` to release the client back to the pool
		done();

		// end/disconnect
		pg.end();
	});
})();
