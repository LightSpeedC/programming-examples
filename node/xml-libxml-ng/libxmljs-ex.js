var libxmljs = require('libxmljs');
var fs = require('fs');

//fs.readFile(__dirname + '/sample.xml', function(err, data) {
var data = "<user scholl='3' class='11'>a<name>mike</name>b<age>19</age>c</user>";

	var xmlDoc = libxmljs.parseXml(data);
	console.log(xmlDoc.toString());
	console.log(xmlDoc.root().text());

	console.log(xmlDoc.get('//root/item[1]').attr('name').value());
//});
