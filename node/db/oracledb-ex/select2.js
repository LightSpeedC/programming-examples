// app.js

var oracledb = require('oracledb');

oracledb.getConnection({
	user: "hr",
	password: "welcome",
	connectString: "localhost/xe"
}, function(err, connection) {
	if (err) {
		console.error(err.message);
		return;
	}
	connection.execute( "SELECT department_id, department_name FROM departments WHERE department_id = 180",
	[],
	function(err, result) {
		if (err) {
			console.error(err.message);
			doRelease(connection);
			return;
		}
		console.log(result.metaData);
		console.log(result.rows);
		doRelease(connection);
	});
});

function doRelease(connection) {
	connection.release(
		function(err) {
			if (err) {console.error(err.message);}
		}
	);
}
