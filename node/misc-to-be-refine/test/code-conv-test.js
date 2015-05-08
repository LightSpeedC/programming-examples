// code-conv-test.js
// 文字コード変換

'use strict';

var fs = require('fs');

var startTime = new Date();
var CodeConv = require('code-conv').CodeConv;
console.log('load maps: %s sec', sec(new Date() - startTime));

testSj2Uni('./code-conv-test-sj.txt');
testUni2Sj('./code-conv-test-uni.txt');
testUni2Sj('./code-conv-test-uni2.txt');

function testSj2Uni(file) {
  var startTime = new Date();
  var buffSj = fs.readFileSync(file);
  console.log('read file: %s sec', sec(new Date() - startTime));

  var startTime = new Date();
  var strUni = CodeConv.convSj2UniSync(buffSj);
  console.log('conv s2u : %s sec', sec(new Date() - startTime));
  var startTime = new Date();
  fs.writeFileSync(file + '-sj2uni.txt', strUni);
  console.log('write    : %s sec', sec(new Date() - startTime));

  var startTime = new Date();
  var buffSj2 = CodeConv.convUni2SjSync(strUni);
  console.log('conv u2s : %s sec', sec(new Date() - startTime));
  var startTime = new Date();
  fs.writeFileSync(file + '-uni2sj.txt', buffSj2);
  console.log('write    : %s sec', sec(new Date() - startTime));
}

function testUni2Sj(file) {
  var startTime = new Date();
  var buffUni = fs.readFileSync(file);
  console.log('read file: %s sec', sec(new Date() - startTime));

  var startTime = new Date();
  var buffSj = CodeConv.convUni2SjSync(buffUni);
  console.log('conv u2s : %s sec', sec(new Date() - startTime));
  var startTime = new Date();
  fs.writeFileSync(file + '-uni2sj.txt', buffSj);
  console.log('write    : %s sec', sec(new Date() - startTime));

  var startTime = new Date();
  var strUni = CodeConv.convSj2UniSync(buffSj);
  console.log('conv s2u : %s sec', sec(new Date() - startTime));
  var startTime = new Date();
  fs.writeFileSync(file + '-sj2uni.txt', strUni);
  console.log('write    : %s sec', sec(new Date() - startTime));

  var startTime = new Date();
  var buffSj2 = CodeConv.convUni2SjSync(strUni);
  console.log('conv u2s : %s sec', sec(new Date() - startTime));
  var startTime = new Date();
  fs.writeFileSync(file + '-uni2sj2.txt', buffSj2);
  console.log('write    : %s sec', sec(new Date() - startTime));
}

function sec(ms) {
  return (ms/1000.0).toFixed(3);
}
