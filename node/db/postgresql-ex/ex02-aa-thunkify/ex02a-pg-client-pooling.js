// http://nodejs.osser.jp/node/node-postgres/
// https://github.com/brianc/node-postgres

// Client pooling

var aa = require('aa');

var pg = require('./pg-thunkify');

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
		var client = yield pg.connect(conString);
	} catch (err) {
		return console.error('error fetching client from pool', err);
	}

	try {
		var result = yield client.query('SELECT $1::int AS num', ['1']);

		//call `done()` to release the client back to the pool
		client.done();
	} catch (err) {
		return console.error('error running query', err);
	}

	console.log(result.rows[0].num);
	//output: 1

	// end/disconnect
	pg.end();
}).catch(function (err) {
	console.error('\x1b[31m' + err.stack + '\x1b[m');
	throw err;
});
