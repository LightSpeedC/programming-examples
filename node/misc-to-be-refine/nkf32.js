/* nkf32.js */

'use strict';

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

// Parallel Processing {並列処理}
var Par = require('par');

var NKF32_EXE = path.resolve(__dirname, 'nkf32.exe');


//######################################################################

/**
 * nkf32. Nihongo Kanji Filter/Converter.
 * 日本語漢字フィルタ(変換)
 * @param inFile String file name for input
 * @param outFile String file name for output
 * @param args array of string arguments for nkf32 UTF-8:['-w'], SJIS:['-s']
 * @param callback function (err)
 */
function nkf32(inFile, outFile, args, callback) {
  // nkf command arguments {nkfコマンド引数}
  var cmdArgs = [];

  for (var i in args)
    cmdArgs.push(args[i]);

  cmdArgs.push(inFile);

  var fd = null;

  var par = new Par(2, function (errLast, results) {
    if (errLast)
      console.log('\u001b[91;41m★nkf32 par エラー: ' + errLast + ' res=' + results + '\u001b[m');
    //console.log('nkf32 end:' + (errLast? ' err=' + errLast: ' OK!') + ' res=' + results);

    //console.log('★close fd=' + fd);
    fs.close(fd, function (errClose) {
      if (errClose)
        console.log('\u001b[91;41m★nkf32 close エラー: ' + errClose + '\u001b[m');
      //console.log('proc stdout end close: err=' + errClose);
      //if (errClose) return par.fail(errClose, 'NG close error'); // throw errClose;
      callback(errLast || errClose);
    });
    fd = null;
  });

//  nextTick(function () {

    // open output file {出力ファイルを開く}
    fs.open(outFile, 'w', function (errOpen, fdOpen) {
      //console.log('★open w fd=' + fdOpen);
      if (errOpen) {
        console.log('\u001b[91;41m★nkf32 open w エラー: ' + errOpen + '\u001b[m');
        throw errOpen;
      }

      fd = fdOpen;

      var proc = spawn(NKF32_EXE, cmdArgs);
      proc.stdin.end();

      // child process stdout on readable {子プロセス標準出力が読込可能}
      proc.stdout.on('readable', function () {
        var buff = proc.stdout.read();
        if (buff === null) return;
        if (!fd) {
          console.log('\u001b[95;45m★nkf32 write既にclose?: ' + buff + '\u001b[m');
          return;
        }
        par.extend(); // 書き込みが終わるまでcloseはしない様に!!
        fs.write(fd, buff, 0, buff.length, null, function (errWrite, written, buff2) {
          if (errWrite)
            console.log('\u001b[91;41m★nkf32 write エラー: ' + errWrite + ' wrt=' + written + ' buff=' + buff + ' fd=' + fd + '\u001b[m');
          //console.log('fd write: err=' + errWrite + ' wrtn=' + written);
          if (errWrite) return par.fail(errWrite, 'NG write error'); // throw errWrite;
          par.done('OK write');
        });
      }); // proc stdout on readable

      // child process stdout on end {子プロセス標準出力が終了}
      proc.stdout.on('end', function () {
        par.done('OK stdout end');
      }); // proc stdout on end

      // child process on error {子プロセスがエラー}
      proc.on('error', function (errProc) {
        if (errProc)
          console.log('\u001b[91;41m★nkf32 proc error エラー: ' + errProc + '\u001b[m');
        // console.log('proc error: err=' + errProc);
        par.fail(errProc, 'NG proc on error'); // throw errProc;
      }); // proc on error

      // child process on exit {子プロセスが終了}
      proc.on('exit', function (code, signal) {
        if (code !== 0)
          console.log('\u001b[91;41m★nkf32 proc exit エラーcode: ' + code + ' sig=' + signal + '\u001b[m');
        //console.log('proc exit: code=' + code + ' sig=' + signal);
        if (code !== 0)
          return par.fail(new Error('exit code ' + code), 'NG proc on exit');
        par.done('OK child process exit');
      }); // proc on exit

    }); // fs.open

//  }); // nextTick

} // function nkf32

module.exports = nkf32;

/**
 * next tick.
 * @param callback function
 */
//function nextTick(callback) { process.nextTick(callback); }
