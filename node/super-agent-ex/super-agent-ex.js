var request = require('superagent');

request
  .get('http://ifconfig.io')
  .end(function (err, res) {
    if (err) throw err;
    console.log(res.body);
  });
