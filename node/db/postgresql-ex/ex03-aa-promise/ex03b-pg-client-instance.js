// http://nodejs.osser.jp/node/node-postgres/
// https://github.com/brianc/node-postgres

// Client instance

var aa = require('aa');

var pg = require('./pg-promise-light');

var host = process.env.PGHOST     || 'localhost';
var port = process.env.PGPORT     || '5432';
var db   = process.env.PGDATABASE || 'postgres';
var user = process.env.PGUSER     || 'postgres';
var pw   = process.env.PGPASSWORD || 'password';

var conString = 'postgres://' + user + ':' + pw + '@' + host + '/' + db;

aa(function *() {
	var client = new pg.Client(conString);
	try {
		yield client.connect();
	} catch (err) {
		return console.error('could not connect to postgres', err);
	}

	try {
		var result = yield client.query('SELECT NOW() AS "theTime"');
	} catch (err) {
		return console.error('error running query', err);
	}

	console.log(result.rows[0].theTime);
	//output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)

	client.end();
}).catch(function (err) {
	console.error('\x1b[31m' + err.stack + '\x1b[m');
	throw err;
});
