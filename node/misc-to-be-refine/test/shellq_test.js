/* shellq_test.js */

var shellq = require('shellq');


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

console.log('cmd=' + cmd + ' ' + args);

shellq(cmd, args, function (err) {
  console.log('終了1' + (err ? ' ' + err : ''));
});
shellq(cmd, args, function (err) {
  console.log('終了2' + (err ? ' ' + err : ''));
});
shellq(cmd, args, function (err) {
  console.log('終了3' + (err ? ' ' + err : ''));

  shellq(cmd, args, function (err) {
    console.log('終了31' + (err ? ' ' + err : ''));
  });

});
