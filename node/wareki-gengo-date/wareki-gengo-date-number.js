// @ts-check

// SEE ALSO:
// https://www.npmjs.com/package/wareki
// https://github.com/tohashi/wareki
// https://github.com/tohashi/wareki/blob/master/src/wareki.js

const gengos = [
	{from:18680125, to:19120729, name:'明治', ryaku:'㍾', alpha:'M', year:0},
	{from:19120730, to:19261224, name:'大正', ryaku:'㍽', alpha:'T', year:0},
	{from:19261225, to:19890107, name:'昭和', ryaku:'㍼', alpha:'S', year:0},
	{from:19890108, to:20190430, name:'平成', ryaku:'㍻', alpha:'H', year:0},
	{from:20190501, to:99999999, name:'令和', ryaku:'㋿', alpha:'R', year:0},
];
gengos.forEach(x => x.year = Math.floor(x.from / 10000) - 1);
gengos.forEach(x => console.log(JSON.stringify(x)));

function date2ymd(dt) {
	return dt.getFullYear() * 10000 + dt.getMonth() * 100 + 100 + dt.getDate();
}

function gan(y) {
	return y === 1 ? '元' : zpad(y, 2);
}
function ymd2wareki(ymd) {
	const gengo = gengos.filter(x => x.from <= ymd && ymd <= x.to)[0];
	if (!gengo) return ymd + '\t西暦' + Math.floor(ymd / 10000) +
	'年' + zpad(Math.floor(ymd / 100) % 100, 2) + '月' + zpad(ymd % 100, 2) + '日\t変換できない';
	return ymd + '\t' + gengo.name + gan(Math.floor(ymd / 10000) - gengo.year) +
		'年' + zpad(Math.floor(ymd / 100) % 100, 2) + '月' + zpad(ymd % 100, 2) + '日';
}

function zpad(n, m) {
	return ('0000' + n).substr(-m);
}

console.log(ymd2wareki(date2ymd(new Date)));
console.log(ymd2wareki(18680124));
console.log(ymd2wareki(18680125));
console.log(ymd2wareki(19120729));
console.log(ymd2wareki(19120730));
console.log(ymd2wareki(19261224));
console.log(ymd2wareki(19261225));
console.log(ymd2wareki(19890107));
console.log(ymd2wareki(19890108));
console.log(ymd2wareki(20181231));
console.log(ymd2wareki(20190101));
console.log(ymd2wareki(20190430));
console.log(ymd2wareki(20190501));
console.log(ymd2wareki(20200501));
console.log(ymd2wareki(20210501));
console.log(ymd2wareki(20220501));
