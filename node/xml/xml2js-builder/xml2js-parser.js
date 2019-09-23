// https://www.npmjs.com/package/xml2js

	'use strict';

	const {Parser} = require('xml2js');

	const xml = '<user scholl="3" class="11">a<name>mike</name>b<age>19</age>c</user>';

	const parser = new Parser();
	parser.parseString(xml,
		(err, result) => console.dir(err || result));
