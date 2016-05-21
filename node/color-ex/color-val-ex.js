void function () {
	'use strict';

	var csi = '\x1b['; // control sequence introducer
	var colors = {
			black: csi + '30m',
			red: csi + '31m',
			green: csi + '32m',
			yellow: csi + '33m',
			blue: csi + '34m',
			magenta: csi + '35m',
			cyan: csi + '36m',
			white: csi + '37m'}
	var bgColors = {
			bgBlack: csi + '40m',
			bgRed: csi + '41m',
			bgGreen: csi + '42m',
			bgYellow: csi + '43m',
			bgBlue: csi + '44m',
			bgMagenta: csi + '45m',
			bgCyan: csi + '46m',
			bgWhite: csi + '47m'};

	function def(colors, reset) {
		Object.keys(colors).forEach(color => {
			Object.defineProperty(String.prototype, color, {
				get: function () {
					return colors[color] + this + reset;
				},
				configurable: true
			});
		});
	}
	def(colors, csi + '39m');
	def(bgColors, csi + '49m');
	def({bold: csi + '1m'}, csi + '21m');
	def({bgLight: csi + '5m'}, csi + '25m');

	console.log('Normal' + 'Red'.red.bgCyan + 'Normal');
	console.log('Normal' + 'Blue'.blue.bgYellow + 'Normal');
	console.log('Normal' + 'Black'.black.bgWhite + 'Normal');
	console.log('Normal' + 'Green'.green.bgMagenta + 'Normal');
	console.log('Normal' + 'Yellow'.yellow.bgBlue + 'Normal');
	console.log('Normal' + 'Magenta'.magenta.bgGreen + 'Normal');
	console.log('Normal' + 'Cyan'.cyan.bgRed + 'Normal');
	console.log('Normal' + 'White'.white.bgBlack + 'Normal');

	console.log('Normal' + 'Bold'.bold + 'Normal');
	console.log('Normal' + 'BgLight'.bgLight + 'Normal');
	console.log(
			('Red' + 'Bold'.bold + 'Red').red + 'Normal');
	console.log(
			('Red' + 'BgLight'.bgLight + 'Red').red + 'Normal');
	console.log(
			('Red' + 'Bold'.bold + 'Red' + ('Red' + 'Bold'.bold + 'Red').bgLight +
			('Red' + 'Bold'.bold + 'Red' + ('Red' + 'Bold'.bold + 'Red').bgLight).bgGreen).red + 'Normal');
	console.log(
			('Red' + 'Bold'.bold + 'Red' + ('Red' + 'Bold'.bold + 'Red').bgLight +
			('Red' + 'Bold'.bold + 'Red' + ('Red' + 'Bold'.bold + 'Red').bgLight).bgWhite).red + 'Normal');
	console.log(csi + '0m' + 'Normal');
}();
