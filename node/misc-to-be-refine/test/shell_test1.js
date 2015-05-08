/* exec_test.js */

var Par = require('par');

//var exec_cmd = 'cmd /c dir /b c:\\gi\\';

var arr = [];
for (var i in process.argv)
  arr.push(process.argv[i]);
arr.shift();
arr.shift();

//var arr = exec_cmd.split(' ');

var cmd = arr.shift()
var args = arr;

//console.log('cmd = ' + cmd);
//console.log('args = ' + args);

var spawn = require('child_process').spawn;


  var proc = spawn(cmd, args);
  var proc2 = spawn('nkf32', ['-S', '-w']);

  var par = new Par(2, function (err, res) {
    //if (err) console.log('par Error: ', err, res);
    proc2.stdin.end();
  });

  var par2 = new Par(4, function (err, res) {
    //if (err) console.log('par2 Error: ', err, res);
    //console.log('\033[97;5m end of line \033[m');
    //process.stdout.write('\033[97;5m[end]\033[m');
  });

  proc.stdin.end();

  proc.stdout.on('readable', function () {
    var buff = proc.stdout.read();
    if (buff === null) return;

    proc2.stdin.write('\033[32m');
    proc2.stdin.write(buff);
    proc2.stdin.write('\033[m');
    //console.log('\033[32m' + buff + '\033[m');
    //console.log('' + buff);
  });

  proc.stderr.on('readable', function () {
    var buff = proc.stderr.read();
    //console.log(buff);
    if (buff === null) return;

    proc2.stdin.write('\033[91;41m');
    proc2.stdin.write(buff);
    proc2.stdin.write('\033[m');
    //console.log('\033[91;41m' + buff + '\033[m');
  });

  proc.stdout.on('end', function () {
    //console.log('proc stdout on end');
    par.done('proc stdout end');
  });
  proc.stderr.on('end', function () {
    //console.log('proc stderr on end');
    par.done('proc stderr end');
  });

  proc.on('error', function (err) {
    //console.log('proc on error: ', err);
    par.fail(new Error('proc error exit: ' + err));
  });

  proc.on('exit', function (code, signal) {
    //if (code !== 0) console.log('proc on exit: ', code, signal);
    if (code !== 0) return par2.fail(new Error('proc exit code=' + code + ' sig=' + signal));
    par2.done('proc exit');
  });

  proc2.stdout.on('readable', function () {
    var buff = proc2.stdout.read();
    if (buff === null) return;

    //console.log(buff.toString());
    process.stdout.write(buff.toString());
  });

  proc2.stderr.on('readable', function () {
    var buff = proc2.stderr.read();
    if (buff === null) return;

    //console.log('\033[95;45m' + buff + '\033[m');
    process.stdout.write('\033[95;45m' + buff + '\033[m');
  });

  proc2.stdout.on('end', function () {
    //console.log('proc2 stdout on end');
    par2.done('proc2 stdout end');
  });
  proc2.stderr.on('end', function () {
    //console.log('proc2 stderr on end');
    par2.done('proc2 stderr end');
  });

  proc2.on('error', function (err) {
    //console.log('proc2 on error: ', err);
    par2.fail(new Error('proc2 error exit: ' + err));
  });

  proc2.on('exit', function (code, signal) {
    //if (code !== 0) console.log('proc2 on exit: ', code, signal);
    if (code !== 0) return par2.fail(new Error('proc2 exit code=' + code + ' sig=' + signal));

    par2.done('proc2 exit code=' + code);
  });

// 日本語
