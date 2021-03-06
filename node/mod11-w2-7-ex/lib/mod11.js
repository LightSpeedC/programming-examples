// modulus 11 weight 2~7

this.mod11 = function () {
  'use strict';

  var W = [2, 3, 4, 5, 6, 7];
  var WL = W.length;
  var Z = '0'.charCodeAt(0);

  function mod11(num) {
    var str = num + '';

    for (var sum = 0, i = 0, j = str.length - 1; j >= 0; i = (i + 1) % WL, --j)
      sum += (str.charCodeAt(j) - Z) * W[i];
    var mod = sum % 11;

    return mod <= 1 ? 0 : 11 - mod;
  }

  if (typeof module === 'object' && module && module.exports)
    module.exports = mod11;

  return mod11;

}();

  var assert = require('assert');

  var mod11 = this.mod11;

  testMod11();

  function testMod11() {
    assert.equal(0, mod11(0));
    assert.equal(0, mod11(14));
    assert.equal(1, mod11(22));
    assert.equal(0, mod11(23));
    assert.equal(5, mod11(12345678));
    assert.equal(2, mod11(123456789));
    assert.equal(1, mod11(987654321));
    assert.equal(6, mod11(4444333999999999));
    assert.equal(7, mod11(123456789012345));
  }
