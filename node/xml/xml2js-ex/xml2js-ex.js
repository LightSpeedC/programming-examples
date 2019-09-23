var xml2js = require('xml2js');
var fs = require('fs');

var parser = new xml2js.Parser();
//fs.readFile(__dirname + '/sample.xml', function(err, data) {
var data = "<user scholl='3' class='11'>a<name>mike</name>b<age>19</age>c</user>";
	parser.parseString(data, function(err, result) {
		console.dir(result);
		//console.dir(result.root.item[0]);
		//console.dir(JSON.stringify(result));
	});
//});
