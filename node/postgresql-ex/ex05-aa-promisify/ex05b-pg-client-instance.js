(function () {
	'use strict';

	var pg = require('pg');
	var aa = require('aa');

	aa.promisify(pg, 'connect', {suffix: 'A'});
	aa.promisify(pg.Client.prototype, 'connect', {suffix: 'A'});
	aa.promisify(pg.Client.prototype, 'query', {suffix: 'A'});

	// Client instance

	var host = process.env.PGHOST     || 'localhost';
	var port = process.env.PGPORT     || '5432';
	var db   = process.env.PGDATABASE || 'postgres';
	var user = process.env.PGUSER     || 'postgres';
	var pw   = process.env.PGPASSWORD || 'password';

	var conString = 'postgres://' + user + ':' + pw + '@' + host + '/' + db;

	aa(function *() {

		var client = new pg.Client(conString);

		try {
			var msg = 'could not connect to postgres';
			yield client.connectA();

			console.log('connected!!!');

			//client.queryA('SELECT $1::int AS numbor', ['1'])
			msg = 'error running query';
			var result = yield client.queryA('select * from s_tenant_r', []);

			//console.log(result.rows[0]);
			console.log(result);

			console.log('client.end()++');
			client.end();
			console.log('client.end()--');
		}
		catch (err) {
			return console.error(msg, err);
		}

		yield aa.wait(100);

		var client = new pg.Client(conString);

		console.log('2nd connectA++');
		yield client.connectA();
		console.log('2nd connectA--');
		var result = yield client.queryA('select * from s_tenant_r', []);
		console.log(result);
		client.end();
		yield aa.wait(100);
	});
})();
