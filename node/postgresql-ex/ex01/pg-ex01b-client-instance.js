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

  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err)
      return console.error('error running query', err);

    console.log(result.rows[0].theTime);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)

    client.end();
  });
});
