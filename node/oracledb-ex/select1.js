var oracledb = require('oracledb');

try { var cfg = require('./dbconfig.js'); }
catch (e) {
  var cfg = {
    user          : "hr",
    password      : "welcome",
    connectString : "localhost/XE"
  };
}

oracledb.getConnection(cfg,
  function(err, connection)
  {
    if (err) { console.error(err); return; }
    connection.execute(
      "SELECT department_id, department_name "
    + "FROM departments "
    + "WHERE department_id < 70 "
    + "ORDER BY department_id",
      function(err, result)
      {
        if (err) { console.error(err); return; }
        console.log(result.rows);
      });
  });
