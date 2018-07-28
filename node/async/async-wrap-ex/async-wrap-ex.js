// http://blog.trevnorris.com/2015/02/asyncwrap-tutorial-introduction.html

// Grab the JS hooks to AsyncWrap.
try {
  var async_wrap = process.binding('async_wrap');
} catch (e) {
  return console.log('async_wrap not supported. use higher version node.js or io.js.');
}

// Setup needed variables and callbacks.
var kCallInitHook = 0;
var asyncHooksObject = {};

function asyncInit() {
  console.log('asyncInit');
  // This propery must be set to an Object.
  this._asyncQueue = {};
}

function asyncBefore() {
  console.log('asyncBefore');
}

function asyncAfter() {
  console.log('asyncAfter');
}

console.log('a100');

// Set all the necessary callbacks.
if (async_wrap.enable) {
  console.log('io.js style');
  async_wrap.setupHooks(asyncInit, asyncBefore, asyncAfter);
  async_wrap.enable();
}
else {
  console.log('node.js style');
  async_wrap.setupHooks(asyncHooksObject, asyncInit, asyncBefore, asyncAfter);
}

console.log('a200');

// Tell AsyncWrap we want callbacks to be called.
asyncHooksObject[kCallInitHook] = 1;

setTimeout(function () {
  console.log('timeout1');
  setTimeout(function () {
    console.log('timeout2');
    setTimeout(function () {
      console.log('timeout3');
    }, 1000);
  }, 1000);
}, 1000);
