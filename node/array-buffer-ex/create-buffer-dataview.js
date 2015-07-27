var buffer = new ArrayBuffer(4 + 2 + 4);
var view = new DataView(buffer);

var offset = 0;

// 4byteの書き込み
view.setUint16(offset, 0x0001, true);
offset += 2;
view.setUint16(offset, 0x0100, true);
offset += 2;

// 2byteの書き込み
view.setUint8(offset, 0xff);
offset += 1;
view.setUint8(offset, 0x0f);
offset += 1;

// 4byteの書き込み
view.setInt16(offset, -50, true);
offset += 2;
view.setUint16(offset, -30, true);
offset += 2;

var result = new Uint8Array(buffer);

console.log(result); // =>  [1, 0, 0, 1, 255, 15, 206, 255, 226, 255]

var ctors = require('get-constructors');
function getNm(x) { return x.name }
console.log(ctors(result).map(getNm));
var obj = result.__proto__;
while (obj) console.log(obj.constructor.name), obj = obj.__proto__;
