// https://www.npmjs.com/package/xml2js

	'use strict';

	var {Parser} = require('xml2js');

	var parser = new Parser();
	var xml = '<user scholl="3" class="11">a<name>mike</name>b<age>19</age>c</user>';
	parser.parseString(xml,
		(err, result) => console.dir(err || result));
