/* tee.js */

var fs = require('fs');
var shell = require('shell');

var arr = [];
for (var i in process.argv)
  arr.push(process.argv[i]);
arr.shift(); // node
arr.shift(); // tee.js
var teeFile = arr.shift(); // tee filename

var options = {colors: true, tee: fs.createWriteStream(teeFile, {flags: 'a'})};

if (arr.length === 0) {
  console.log('引数がありません');
  return;
}

var cmd = arr.shift()
var args = arr;

shell(cmd, args, options, function (err) {
  if (err) console.log('\u001b[31;1m' + err.toString() + '\u001b[m');
});
