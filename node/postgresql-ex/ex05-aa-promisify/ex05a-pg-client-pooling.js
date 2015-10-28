(function () {
	'use strict';

	var pg = require('pg');
	var aa = require('aa'), promisify = aa.promisify, Channel = aa.Channel;

	function defineMethodA(obj, method) {
		var methodAcached = method + 'Acached';
		Object.defineProperty(obj, method + 'A', {
			get: function () {
				return this[methodAcached] ? this[methodAcached] :
					this[methodAcached] = promisify(this, this[method]);
			}
		});
	}

	defineMethodA(pg, 'connect');
	defineMethodA(pg.Client.prototype, 'connect');
	defineMethodA(pg.Client.prototype, 'query');

	// Client pooling

	var host = process.env.PGHOST     || 'localhost';
	var port = process.env.PGPORT     || '5432';
	var db   = process.env.PGDATABASE || 'postgres';
	var user = process.env.PGUSER     || 'postgres';
	var pw   = process.env.PGPASSWORD || 'password';

	var conString = 'postgres://' + user + ':' + pw + '@' + host + '/' + db;

	aa(function *() {
		try {
			var msg = 'error fetching client from pool';

			var result = yield pg.connectA(conString);
			var client = result[0], done = result[1];

			console.log('connected!!!');

			msg = 'error running query';

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

		pg.end();
	});
})();
