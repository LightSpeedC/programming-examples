//require("babel-polyfill");
//require("regenerator-runtime/runtime");

function *gfn() {
  yield 1;
}

function fn() {
  return 1;
}

function isGenerator(x) {
  return typeof x === 'function' && x.constructor.name === 'GeneratorFunction';
}

function isGeneratedGenerator(x) {
  return isGenerator(x) && typeof x.prototype.constructor == 'object';
}

console.log();

const data = [fn, gfn /*, Object, Function*/];
//console.log('typeof gfn\n', data.map(x => [x.name, typeof x]));
//console.log('typeof gfn.prototype', data.map(x => x.prototype).map(x => typeof x));
console.log('typeof gfn.constructor\n', data.map(x => x.constructor).map(x => [x.name, typeof x]));
console.log('typeof gfn.prototype.constructor\n', data.map(x => x.prototype.constructor).map(x => [x.name, typeof x]));
console.log('isGenerator(gfn)', data.map(x => [x.name, isGenerator(x)]));
console.log('isGeneratedGenerator(gfn)', data.map(x => [x.name, isGeneratedGenerator(x)]));
