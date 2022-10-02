var inspect = require('util').inspect;
function log(obj) {
	if (obj instanceof Error)
		console.error('\x1b[41mError:', obj, '\x1b[m');
	else
		console.log(typeof obj === 'string' ? obj : inspect(obj, {colors: true}));
}

var oracledb = require('oracledb');

try { var cfg = require('./dbconfig-local.json'); }
catch (e) {
	log(['*** "dbconfig-local.json" not found! use default dbconfig... ***']);
	var cfg = require('./dbconfig-default.json');
}

oracledb.getConnection(cfg,
	function(err, connection)
	{
		if (err) { log(err); return; }

		log(oracledb);
		log(oracledb.__proto__);
		// oracledb.outFormat = oracledb.ARRAY;
		// oracledb.outFormat = oracledb.OBJECT;

		log(connection.constructor.name);
		log(connection);
		log(connection.__proto__);
		connection.execute(
			"SELECT '111' AAA FROM dual ",
			{},
			//{outFormat: oracledb.OBJECT},
			{outFormat: oracledb.ARRAY},
			function(err, result)
			{
				connection.release(function (err) {
					if (err) { log(err); return; }
					log('connection released.');
				});
				if (err) { log(err); return; }
				log(result.rows);
				log(result);
			});
	});
