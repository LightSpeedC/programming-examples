true.prop1 = 'abc';
console.log(true.prop1);
//���Ăǂ������Ӗ��Ȃ̂��B
//���̕ӂ�ɓ������B����Ă���l�Ɏv����B
//������undefined���B�ꎞ�I�ɍ��ꂽ�I�u�W�F�N�g�̑���(�v���p�e�B)�ȂǕێ�����Ȃ��̂��B

t = Boolean(true);
t.prop1 = 'abc';
console.log(t, t.prop1);
//�͓�����true undefined�ɂȂ�B

o = new Boolean(true);
o.prop1 = 'abc';
console.log(o + ' ' + o.prop1);
//�͓�����true abc�ɂȂ�B


n = new Number(123);
console.log(n !== 123); // -> true
console.log(n == 123); // -> true

b = new Boolean(true);
console.log(b !== true); // -> true
console.log(b == true); // -> true
console.log(b !== 1); // -> true
console.log(b == 1); // -> true
console.log(b.valueOf() !== 1); // -> true
console.log(b.valueOf() === true); // -> true

s = new String('str');
console.log(s !== 'str'); // -> true
console.log(s == 'str'); // -> true
