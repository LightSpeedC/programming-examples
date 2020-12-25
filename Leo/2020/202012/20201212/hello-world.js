console.log('hello world');
console.log('\'<>\'');
console.log('◇');
console.log('(・_・);');
console.log("◇");

let 合計 = 0;
let i = 0;
for (i = 1; i <= 1000; ++i) {
	合計 += i;
	if (i % 100 === 0) console.log({i, 合計});
}
// console.log({i, 合計});
