// https://www.npmjs.com/package/xml2js

	'use strict';

	const {Builder} = require('xml2js');

	const obj = {name: 'Super', Surname: 'Man', age: 23};

	const builder = new Builder();
	const xml = builder.buildObject(obj);
	console.log(xml);
