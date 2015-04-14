(function () {
  'use strict';

  var http = require('http');
  var fs = require('fs');
  var path = require('path');
  var port = Number(process.argv[2] || 8000);
  var mimes = {'.js': 'application/javascript', '.html': 'text/html; charset=UTF8'};
  http.createServer(function (req, res) {
    console.log(req.url);
    res.writeHead(200, {'Content-Type':
        mimes[path.extname(req.url) || '.html'] || mimes['.html']});
    var stream = fs.createReadStream(path.join(__dirname, req.url));
    stream.pipe(res);
    stream.on('error', function (err) {
      console.log('err:' + err);
      res.end();
    });
  }).listen(port, function () { console.log('listening...', port);  });
})();
