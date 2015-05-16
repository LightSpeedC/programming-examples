(function () {
  'use strict';

  var fg;
  try { fg = eval('(function *() { yield 1; yield 2; })'); } catch (e) {} // es6

  var slice = [].slice;
  function log() {
    var msg = slice.call(arguments).join(' ');
    if (/not supported/.test(msg)) {
      if (typeof window === 'undefined')
        console.error('\x1b[1;31m' + msg + '\x1b[m');
      else
        console.error(msg);
    }
    else
      console.info(msg);
  }

  var Symbol_iterator = typeof Symbol === 'function' && Symbol &&
      Symbol.iterator || 'Symbol.iterator not supported';

  // firefox & chrome, node.js/io.js
  var o = {};
  o[Symbol_iterator] = fg;
  for (var i in o) log('Symbol.iterator(in):', i);
  try { eval('for (var i of o) log(\'Symbol.iterator(of):\', i);'); }
  catch (e) { log('for of not supported'); }

  // firefox
  var o = {__iterator__: fg};
  for (var i in o) {
    if (i === '__iterator__') {
      log('fg: __iterator__ not supported');
      break;
    }
    log('fg(in):', i);
  }

  //**********************************************************************
  // RangeEs6
  function RangeEs6(low, high){
    this.low = low;
    this.high = high;
  }
  try { eval(
    'RangeEs6.prototype[Symbol_iterator] = function *() {' +
    '  for (var i = this.low; i <= this.high; i++)' +
    '    yield i;' +
    '};');

    var range = new RangeEs6(3, 5);
    for (var i in range) {
      log('RangeEs6(in):', i);
    }
    // -> 3, 4, 5

    eval('for (var i of range) log(\'RangeEs6(of):\', i);');

  } catch (e) {}

  //**********************************************************************
  // RangeFf
  function RangeFf(low, high){
    this.low = low;
    this.high = high;
  }
  try { eval(
    'RangeFf.prototype.__iterator__ = function *(){' +
    '  for (var i = this.low; i <= this.high; i++)' +
    '    yield i;' +
    '};');
    var range = new RangeFf(3, 5);
    for (var i in range) {
      if (i === '__iterator__') {
        log('RangeFf: __iterator__ not supported');
        break;
      }
      log('RangeFf(in):', i);
    }
    // -> 3, 4, 5

  } catch (e) { log('for of __iterator__ not supported'); }

})();
