// 深く潜る
function diveDeep(n) {
	try {
		return diveDeep(n + 1);
	} catch (e) {
		return {count: n, error: e};
	}
}

// メイン
displayVersion(); // バージョンを表示
var result = diveDeep(0); // 深く潜る
// 結果を表示
pr('Maximum call stack size: ' + result.count);
pr('Error: ' + result.error);
var keys = (Object.getOwnPropertyNames || Object.keys)(result.error);
for (var i in keys)
	pr('Error.' + keys[i] + ': ' + result.error[keys[i]]);

// ブラウザのバージョン等を表示
function displayVersion() {
	pr(typeof navigator !== 'undefined' &&
			navigator.userAgent &&
			'Browser: ' + navigator.userAgent ||
		typeof process !== 'undefined' &&
			process.version &&
			'Node.js: ' + process.version ||
		'other');
}

// 表示
function pr(x) {
	if (typeof document !== 'undefined' && document.writeln)
		document.writeln((x + '\n\n').split('\n').join('<br/>\n'));
	/*else*/ if (typeof console !== 'undefined' && console.log)
		console.log(x);
	else if (typeof print !== 'undefined')
		print(x);
}
