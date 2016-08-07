// http://nodejs.osser.jp/node/node-xml-js/
// https://www.npmjs.com/package/xml2js

	'use strict';
	const {parseString} = require('xml2js');

	parseString('<root>Hello xml2js!</root>',
		(err, result) => console.dir(err || result));

	const xml = '<user scholl="3" class="11">a<name>mike</name>b<age>19</age>c</user>';
	parseString(xml,
		(err, result) => console.dir(err || result));

	// 変換optionsを指定
	parseString(xml, {trim: true},
		(err, result) => console.dir(err || result));
