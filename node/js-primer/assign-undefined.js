global.undefined = 'グローバル';
console.log(undefined);
console.log(global.undefined);
console.log(undefined);
var undefined = 10;
console.log(undefined);
var undefined = '未定義';
console.log(undefined);

console.log(arguments);
console.log(arguments.callee + '');
//console.log(arguments.caller);

function fn(){
	var undefined = "独自の未定義値"; // undefinedと名前の変数をエラーなく定義できる
	console.log(undefined); // => "独自の未定義値"
}
fn();

