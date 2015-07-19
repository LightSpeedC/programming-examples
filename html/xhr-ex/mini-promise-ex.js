  var MiniPromise = require('./mini-promise');
  var nextTick = MiniPromise.nextTick;

  nextTick(function () { console.log('OK00: nextTick'); });

  new MiniPromise(function (res, rej) { res(123); })
  .then(function (val) { console.log('OK11:', val); },
        function (err) { console.log('NG12:', err); })
  .then(function (val) { console.log('OK13:', val); },
        function (err) { console.log('NG14:', err); });

  new MiniPromise(function (res, rej) { rej(new Error); })
  .then(function (val) { console.log('OK21:', val); },
        function (err) { console.log('NG22:', err); })
  .then(function (val) { console.log('OK23:', val); },
        function (err) { console.log('NG24:', err); });

  // unhandled rejection
  var p3 = new MiniPromise(function (res, rej) { rej(new Error); });
  // unhandled rejection handled
  setTimeout(function () {
    p3.then(function (val) { console.log('OK31:', val); },
            function (err) { console.log('NG32:', err); }) }, 200);
