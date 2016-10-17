'use strict';

let x = shuffle2([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10);
console.log(x);
console.log(x.sort());

function shuffle2(arr, n) { // Fisher-Yates
	var ret = arr.concat(), len = ret.length, n = n < len ? n : len, i = len, j, t;
	while (i) t = ret[j = Math.random()*i--|0], ret[j] = ret[i], ret[i] = t;
	ret.length = n;
	return ret;
}

// http://qiita.com/ao_kiken/items/582dd7726cc30c7c6c22
// https://h2ham.net/javascript-random-array
// https://h2ham.net/javascript-で配列のシャッフル
// http://d.hatena.ne.jp/miya2000/20080607/p0
// http://d.hatena.ne.jp/murky-satyr/20080608/1212864205
