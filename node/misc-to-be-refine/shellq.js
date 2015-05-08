/* shellq.js */

'use strict';

// Shell Command Execute {シェル・コマンド起動}
var shell = require('shell');

// shell execution queue {実行キュー(shellへの引数の配列のキュー)}
var shellQueue = [];

// shell executing {実行中}
var shellExecuting = false;

/**
 * shellq.
 *
 * @param cmd execute to command {実行するコマンド}
 * @param args arguments array {コマンドの引数}
 * @param options options object {のオプション}
 * @param callback function (err) {コールバック関数}
 */
function shellq(cmd, args, options, callback) {
  // 引数を配列にコピーする
  var argsCopied = [];
  for (var i = 0, n = arguments.length; i < n; ++i) {
    if (typeof arguments[i] === 'function') {
      // 関数の場合は callback なので特殊な処理を間に入れる
      argsCopied.push(function (cb) {
        return function(err) {
          // callback を呼ぶ
          cb(err);
          // shellQueue が空であれば、実行中の状態をOFFにする
          if (shellQueue.length == 0)
            return shellExecuting = false;
          // 実行中なので継続する
          args = shellQueue.shift();
          shellExecuting = true;
          //console.log('実行継続-> ' + args[0] + ' ' + args[1]);
          shell.apply(this, args);
        };
      }(arguments[i]));
    }
    else
      argsCopied.push(arguments[i]);
  }
  shellQueue.push(argsCopied);

  // 実行中でなく、shellQueueが1つのみであれば、実行を開始する
  if (! shellExecuting && shellQueue.length == 1) {
    args = shellQueue.shift();
    shellExecuting = true;
    //console.log('実行開始-> ' + args[0] + ' ' + args[1]);
    shell.apply(this, args);
  }
}

module.exports = shellq;
