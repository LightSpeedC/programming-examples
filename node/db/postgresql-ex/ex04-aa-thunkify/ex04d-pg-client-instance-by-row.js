// http://nodejs.osser.jp/node/node-postgres/
// https://github.com/brianc/node-postgres

	// Client instance
	var pg = require('pg');

	var host = process.env.PGHOST     || 'localhost';
	var port = process.env.PGPORT     || '5432';
	var db   = process.env.PGDATABASE || 'postgres';
	var user = process.env.PGUSER     || 'postgres';
	var pw   = process.env.PGPASSWORD || 'password';

	var conString = 'postgres://' + user + ':' + pw + '@' + host + '/' + db;

	var client = new pg.Client(conString);
	client.connect(function(err) {
		if(err)
			return console.error('could not connect to postgres', err);

		var query = client.query('SELECT NOW() AS "theTime"');
		query.on('row', function (row, result) {
			console.log(row);
			//output: {theTime: Tue Jan 15 2013 19:12:47 GMT-600 (CST)}
			console.log(result);
		});

		query.on('error', function (err) {
			console.error('error running query', err);
			end();
		});

		query.on('end', end);

		function end() {
			// end/disconnect
			client.end();
		}

	});
