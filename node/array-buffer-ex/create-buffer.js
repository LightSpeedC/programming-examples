var buffer = new ArrayBuffer(4 + 2 + 4); // 4 + 2 + 4byteのバッファを確保

// 4byteの書き込みを行うビューを生成
var ary_u16 = new Uint16Array(buffer, 0, 2);
ary_u16[0] = 0x0001;
ary_u16[1] = 0x0100;

// 1byteの書き込みを行うビューを生成
var ary_u8 = new Uint8Array(buffer, 4, 2);
ary_u8[0] = 0xff;
ary_u8[1] = 0x0f;

// 4byteの書き込みを行うビューを生成
var ary_i16 = new Int16Array(buffer, 6, 2);
ary_i16[0] = -50;
ary_i16[1] = -30;

var result = new Uint8Array(buffer);

console.log(result); // => [1, 0, 0, 1, 255, 15, 206, 255, 226, 255]

var ctors = require('get-constructors');
function getNm(x) { return x.name }
console.log(ctors(result).map(getNm));
var obj = result.__proto__;
while (obj) console.log(obj.constructor.name), obj = obj.__proto__;
