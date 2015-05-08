/* shell-test.js */

var shell = require('shell');

var arr = [];
for (var i in process.argv)
  arr.push(process.argv[i]);
arr.shift(); // node
arr.shift(); // *.js

if (arr.length === 0) {
  console.log('引数がありません');
  return;
}

var cmd = arr.shift()
var args = arr;


shell(cmd, args, function (err) {
  console.log('[終了]' + (err ? ' ' + err : ''));
  shell(cmd, args, {colors: true}, function (err) {
    console.log('[終了]' + (err ? ' ' + err : ''));
  });
});
