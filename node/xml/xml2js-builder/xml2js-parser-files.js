// https://www.npmjs.com/package/xml2js
// https://msdn.microsoft.com/ja-jp/library/ms762271.aspx (bools.xml)

	'use strict';

	const {Parser} = require('xml2js');
	const fs = require('fs');

	['books-sp.xml', 'books-tab.xml'].forEach(
		file => fs.readFile(file,
			(err, xml) => (new Parser()).parseString(xml,
				(err, result) =>
					console.log(require('util').inspect({[file]:
						err || result}, {colors:true, depth:null})))
	));
