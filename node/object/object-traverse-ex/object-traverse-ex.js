'use strict';

var util = require('util');
var ins1 = function (x) { return util.inspect(x, {colors: true}); };
var ins2 = function (x) { return ins1(x).replace(/\x27/g, ''); };
var ins3 = function (x) { return ins1(x).replace(/(\x27|\{\s|\s\}|\]|:)/g, '').replace(/\[Function/g, 'fn'); };
var stri = JSON.stringify;

var o = {x:1, y: "ss", z: true, w: {}, v: []};
disp(o);
disp([1,2,3]);

function rpad(n, m) {
  return (n + '                                        ').slice(0, m);
}

function disp(o) {
  while (o) {
    console.log((o.hasOwnProperty('constructor') ? '' : 'instance of ') + o.constructor.name);
    var a = Object.getOwnPropertyNames(o);
    //console.log(ins(a.join(', ')));

    for (var i = 0, n = a.length; i < n; ++i) {
      var b = a[i];
      var d = Object.getOwnPropertyDescriptor(o, b);
      var c = '';
      if (d.writable)     c += 'W'; else c += 'w'; delete d.writable;
      if (d.enumerable)   c += 'E'; else c += 'e'; delete d.enumerable;
      if (d.configurable) c += 'C'; else c += 'c'; delete d.configurable;
      console.log(c, rpad(ins2(b), 30), '\t' + ins3(d));
    }

    console.log();
    o = o.__proto__;
  }
}
