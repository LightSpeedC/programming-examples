'use strict';

let x = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
console.log(x);
console.log(x.sort());

function shuffle(src) {
	const tmp = src.slice();
	const dst = [];
	let n = 0;
	while (n = tmp.length) {
		let m = Math.random() * n | 0;
		dst.push(tmp[m]);
		let x = tmp.pop();
		if (m !== tmp.length)
			tmp[m] = x;
	}
	return dst;
}

// http://qiita.com/ao_kiken/items/582dd7726cc30c7c6c22
// https://h2ham.net/javascript-random-array
// https://h2ham.net/javascript-で配列のシャッフル
// http://d.hatena.ne.jp/miya2000/20080607/p0
// http://d.hatena.ne.jp/murky-satyr/20080608/1212864205
