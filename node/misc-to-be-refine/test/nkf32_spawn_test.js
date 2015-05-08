/* nkf32_spawn_test.js */

var fs = require('fs');
var spawn = require('child_process').spawn;

fs.open('nkf32_utf8.txt', 'w', function (err, fd) {

  var nkf1 = spawn('nkf32.exe', ['-S', '-w', 'nkf32.txt']);
  nkf1.stdin.end();

  nkf1.stdout.on('readable', function () {
    var buff = nkf1.stdout.read();
    console.log(buff);
    if (buff === null) return;
    fs.write(fd, buff, 0, buff.length, null, function () {
      console.log('write callback');
    });
  });

  nkf1.stdout.on('end', function () {
    console.log('end: ', arguments.length, arguments);
    fs.close(fd, function (err) {
      if (err) throw err;
      console.log('end close: ', arguments.length, arguments);
    });
  });

  nkf1.on('error', function (err) {
    console.log('error: ', err);
  });

  nkf1.on('exit', function (code) {
    console.log('exit: ', code);
  });

}); // fs.open

// 日本語
