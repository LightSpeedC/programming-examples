// SEE ALSO:
// https://www.npmjs.com/package/wareki
// https://github.com/tohashi/wareki
// https://github.com/tohashi/wareki/blob/master/src/wareki.js

const gengos = [
	{from:18680125, to:19120729, name:'明治', ryaku:'㍾', alpha:'M'},
	{from:19120730, to:19261224, name:'大正', ryaku:'㍽', alpha:'T'},
	{from:19261225, to:19890107, name:'昭和', ryaku:'㍼', alpha:'S'},
	{from:19890108, to:20190430, name:'平成', ryaku:'㍻', alpha:'H'},
	{from:20190501, to:99999999, name:'令和', ryaku:'㋿', alpha:'R'},
];
gengos.forEach(x => x.year = Math.floor(x.from / 10000) - 1);
//console.log(gengos);

function date2ymd(dt) {
	return dt.getFullYear() * 10000 + dt.getMonth() * 100 + 100 + dt.getDate();
}

function gan(y) {
	return y === 1 ? '元' : y;
}
function ymd2wareki(ymd) {
	const gengo = gengos.filter(x => x.from <= ymd && ymd <= x.to)[0];
	if (!gengo) return ymd;
	return ymd + '\t' + gengo.name + gan(Math.floor(ymd / 10000) - gengo.year) +
		'年' + Math.floor(ymd / 100) % 100 + '月' + ymd % 100 + '日';
}

console.log(date2ymd(new Date));
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
