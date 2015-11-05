var oracledb = require('oracledb');

oracledb.createPool (
  {
    user: 'hr',
    password: 'hello',
    connectString: localhost/xe,
    poolMax: 4, // maximum size of the pool
    poolMin: 0, // let the pool shrink completely
    poolIncrement: 1, // only grow the pool by one connection at a time
    poolTimeout: 0  // never terminate idle connections
  },
  function(err, pool) {
    if (err) throw err;
 
    pool.getConnection(function(err, connection) {
      //do something with the connection
    });
  }
);
