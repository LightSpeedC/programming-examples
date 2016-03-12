// ズンズンズンズンドコキ・ヨ・シ!

void function () {
	'use strict';

	var phrase = 'ズンズンズンズンドコ';

	var puts = typeof process === 'object' && process &&
			typeof process.stdout === 'object' && process.stdout &&
			typeof process.stdout.write === 'function' ?
		process.stdout.write.bind(process.stdout) :
		console.log.bind(console);

	var generated = '';
	do {
		var choise = ['ズン', 'ドコ'][Math.random() * 2 | 0];
		puts(choise);
		generated = (generated + choise).substr(- phrase.length);
	} while (generated !== phrase);
	puts('キ・ヨ・シ！');
}();
