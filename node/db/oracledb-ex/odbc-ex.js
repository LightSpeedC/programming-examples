/*
 * oracle test
 */

var odbc = require("odbc");

var db = new odbc.Database();
var cs = "DSN=<DataSourceName>;UID=<UserName>;PWD=<Password>";
db.open(cs, function(err){
	var sql = "select foo, bar from HOGE order by foo";
	db.query(sql, function(err, rows, rs){
		//console.log(rows);
		var i=0;
		for (i=0; i<rows.length; i++) {
			console.log([
				i,
				rows[i]["foo"],
				rows[i]["bar"]
			].join(", "));
		}

		db.close(function(){
			console.log("close.");
		});
	});
});
