/* shell.js */

'use strict';

var path = require('path');
var spawn = require('child_process').spawn;

// Parallel Processing {並列処理}
var Par = require('par');

// Code Conv {文字コード変換}
var CodeConv = require('code-conv').CodeConv;
var convAny2UniSync = CodeConv.convAny2UniSync;

// Ignore error messages {無視するエラーメッセージ}
// notice patterns
var noticePatterns = [/^psql:.* NOTICE: /, /^Picked up _JAVA_OPTIONS: .*/];

// Color definitions {カラー定義}
var COLOR_NORMAL = '\u001b[m';
var COLOR_STDERR = '\u001b[91;41m';	// RED
var COLOR_STDOUT = '\u001b[36m';	// CYAN
var COLOR_NOTICE = '\u001b[32m';	// GREEN

//######################################################################
/**
 * shell command execute. {シェルコマンド実行}
 *
 * @param cmd execute to command string {実行するためのコマンド}
 * @param args array of string arguments {引数の配列}
 * @param options object (optional)
 *          stdout: process.stdout {オプション：標準出力ストリーム}
 *          colors: true or false {オプション：カラー}
 *          timeout: timeout [msec] {オプション：タイムアウト}
 *          tee: copy output stream (default: none) {オプション：コピーストリーム}
 * @param callback function (err) {コールバック関数}
 *
 * @return process {プロセス}
 */
function shell(cmd, args, options, callback) {
  // 引数 options が省略された時の引数の入れ替え
  if (typeof options === 'function' && typeof callback === 'undefined') {
    callback = options;
    options = {};
  }

  // options.stdout (default: process.stdout)
  var stdout = options.stdout || process.stdout;
  var stderr = options.stderr || process.stderr;
  var tee = options.tee || null;

  // options.colors = true or false
  //if (!('colors' in options)) options.colors = false;
  options.colors = !!options.colors;

  var errShell = null;
  var proc = spawn(cmd, args);
  var pid = proc.pid;

  proc.stdin.end();

  var timer = null;

  // options.timeout (msec)
  if (options.timeout)
    timer = setTimeout(function () {
      if (pid) {
        process.kill(pid);
        pid = 0;
        errShell = new Error('Shell process killed on timeout');
      }
      timer = null;
    }, options.timeout);

  var par = new Par(3, function (errCallback, res) {
    pid = 0;
    if (timer) clearTimeout(timer), timer = null;

    if (errShell)
      return callback(errShell);

    if (errCallback)
      return callback(errCallback);

    return callback(null);
  });

  // Standard output 標準出力
  proc.stdout.on('readable', function () {
    var buff = proc.stdout.read();
    if (!buff) return;

    var str = convAny2UniSync(buff).replace(/\r\r/g, '\r');

    if (options.colors)
      stdout.write(COLOR_STDOUT + str + COLOR_NORMAL);
    else
      stdout.write(str);
    if (tee) tee.write(str);
  }); // proc.stdout.on readable

  // Standard error 標準エラー出力
  proc.stderr.on('readable', function () {
    setTimeout(finalStdErrRead, 20); // wait 20 msec
  }); // proc.stderr.on readable

  function finalStdErrRead() {
    var buff = proc.stderr.read();
    if (!buff) return;

    var str = convAny2UniSync(buff).replace(/\r\r/g, '\r');
    if (!options.colors) {
      stdout.write(str);
      if (tee) tee.write(str);
      return;
    } // if !options.colors

    var strList = str.split('\n');
    var idxLast = strList.length - 1;
    strList.forEach(function (str, idx) {
      if (idx < idxLast) str += '\n';
      var color = COLOR_STDERR;
      for (var i = 0, n = noticePatterns.length; i < n; ++i) {
        if (str.match(noticePatterns[i])) {
          color = COLOR_NOTICE;
          break;
        }
      }

      stdout.write(color + str + COLOR_NORMAL);
      if (tee) tee.write(str);
    }); // strList.forEach
    }

  proc.stdout.on('end', function () {
    par.done('proc stdout end');
  }); // proc.stdout.on end

  proc.stderr.on('end', function () {
    par.done('proc stderr end');
  }); // proc.stderr.on end

  proc.on('error', function (err) {
    par.fail(err);
  }); // proc.on error

  proc.on('exit', function (code, signal) {
    finalStdErrRead();
    pid = 0; // if process exit

    if (code !== 0)
      return par.done(new Error('Shell process exited error code: ' + code + 
        (signal ? ' and signal code: ' + signal : '')));

    par.done('proc exit');
  }); // proc.on exit

  return proc;
} // shell

module.exports = shell;
