  var util = require('util');

  console.log('########');
  console.log('Object.getOwnPropertyNames');
  fn1({}.__proto__);
  function fn1(obj) {
    Object.getOwnPropertyNames(obj).forEach(function (prop) {
      console.log('\x1b[1;31m%s\x1b[m %s', prop, util.inspect(
        Object.getOwnPropertyDescriptor(obj, prop), {colors:true})
          .replace(/\n /g,''));
    });
  }

  console.log('########');
  console.log('Object.keys');
  fn2({}.__proto__);
  function fn2(obj) {
    Object.keys(obj).forEach(function (prop) {
      console.log('\x1b[1;33m%s\x1b[m %s', prop, util.inspect(
        Object.getOwnPropertyDescriptor(obj, prop), {colors:true})
          .replace(/\n /g,''));
    });
  }

  console.log('########');
  console.log('for in');
  fn3({}.__proto__);
  function fn3(obj) {
    var keys = [];
    for (var k in obj) keys.push(k);
    keys.forEach(function (prop) {
      console.log('\x1b[1;35m%s\x1b[m %s', prop, util.inspect(
        Object.getOwnPropertyDescriptor(obj, prop), {colors:true})
          .replace(/\n /g,''));
    });
  }
