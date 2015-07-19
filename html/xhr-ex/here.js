  var mimes = {'.html': 'text/html', '.js': 'text/javascript'};
  var fs = require('fs');
  var util = require('util');
  var path = require('path');
  var http = require('http')
  var dirnameRex = RegExp((__dirname + '\\').replace(/\\/g, '(/|\\\\\\\\?)'), 'g');
  http.createServer(function (req, res) {
    var file = req.url;
    if (file === '/echo') {
      console.log('--:', req.url);
      res.writeHead(200, {'content-type': 'application/json'});
      req.pipe(res);
      return;
    }

    if (file.endsWith('/')) file += 'index.html';
    file = path.join(__dirname, file);
    console.log('--:', req.url, file);
    fs.readFile(file, function (err, data) {
      if (err) {
        console.log('NG:', req.url, file, err);
        res.writeHead(404, {'content-type': 'text/plain'});
        res.end(util.inspect(err).replace(dirnameRex, '?/'));
      }
      else {
        console.log('OK:', req.url, file);
        res.writeHead(200, {'content-type': mimes[path.extname(file)]});
        res.end(data);
      }
    });
  }).listen(8080, function () {
    console.log('listen start...');
  });
