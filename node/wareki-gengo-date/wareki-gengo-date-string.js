// @ts-check

// SEE ALSO:
// https://www.npmjs.com/package/wareki
// https://github.com/tohashi/wareki
// https://github.com/tohashi/wareki/blob/master/src/wareki.js

const gengos = [
	{from:'18680125', to:'19120729', name:'明治', ryaku:'㍾', alpha:'M', year:0},
	{from:'19120730', to:'19261224', name:'大正', ryaku:'㍽', alpha:'T', year:0},
	{from:'19261225', to:'19890107', name:'昭和', ryaku:'㍼', alpha:'S', year:0},
	{from:'19890108', to:'20190430', name:'平成', ryaku:'㍻', alpha:'H', year:0},
	{from:'20190501', to:'99999999', name:'令和', ryaku:'㋿', alpha:'R', year:0},
];
gengos.forEach(x => x.year = Number(x.from.substring(0, 4)) - 1);
gengos.forEach(x => console.log(JSON.stringify(x)));

function date2ymd(dt) {
	return dt.getFullYear() + zpad(dt.getMonth() + 1, 2) + zpad(dt.getDate(), 2);
}

function gan(y) {
	return Number(y) === 1 ? '元' : y;
}
function ymd2wareki(ymd) {
	const gengo = gengos.filter(x => x.from <= ymd && ymd <= x.to)[0];
	if (!gengo) return ymd + '\t西暦' + ymd.substring(0, 4) +
		'年' + ymd.substring(4, 6) + '月' + ymd.substring(6, 8) + '日\t変換できない';
	return ymd + '\t' + gengo.name + gan(zpad(ymd.substring(0, 4) - gengo.year, 2)) +
		'年' + ymd.substring(4, 6) + '月' + ymd.substring(6, 8) + '日';
}

function zpad(n, m) {
	return ('0000' + n).substr(-m);
}

console.log(ymd2wareki(date2ymd(new Date)));
console.log(ymd2wareki('18680124'));
console.log(ymd2wareki('18680125'));
console.log(ymd2wareki('19120729'));
console.log(ymd2wareki('19120730'));
console.log(ymd2wareki('19261224'));
console.log(ymd2wareki('19261225'));
console.log(ymd2wareki('19890107'));
console.log(ymd2wareki('19890108'));
console.log(ymd2wareki('20181231'));
console.log(ymd2wareki('20190101'));
console.log(ymd2wareki('20190430'));
console.log(ymd2wareki('20190501'));
console.log(ymd2wareki('20200501'));
console.log(ymd2wareki('20210501'));
console.log(ymd2wareki('20220501'));
