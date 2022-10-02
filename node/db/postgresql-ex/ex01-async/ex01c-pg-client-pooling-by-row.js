// http://nodejs.osser.jp/node/node-postgres/
// https://github.com/brianc/node-postgres

	// Client pooling
	var pg = require('pg');

	var host = process.env.PGHOST     || 'localhost';
	var port = process.env.PGPORT     || '5432';
	var db   = process.env.PGDATABASE || 'postgres';
	var user = process.env.PGUSER     || 'postgres';
	var pw   = process.env.PGPASSWORD || 'password';

	var conString = 'postgres://' + user + ':' + pw + '@' + host + '/' + db;

	//this starts initializes a connection pool
	//it will keep idle connections open for a (configurable) 30 seconds
	//and set a limit of 20 (also configurable)
	pg.connect(conString, function (err, client, done) {
		if (err)
			return console.error('error fetching client from pool', err);

		var query = client.query('SELECT $1::int AS num', ['1']);
		query.on('row', function (row, result) {
			console.log(row);
			//output: {num: 1}
			console.log(result);
		});

		query.on('error', function (err) {
			console.error('error running query', err);
			end();
		});

		query.on('end', end);

		function end() {
			//call `done()` to release the client back to the pool
			done();

			// end/disconnect
			pg.end();
		}

	});
