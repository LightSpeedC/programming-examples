// http://nodejs.osser.jp/node/node-xml-js/

var parseString = require('xml2js').parseString;
parseString("<root>Hello xml2js!</root>", function (err, result) {
	console.dir(result);
});

xml = "<user scholl='3' class='11'>a<name>mike</name>b<age>19</age>c</user>";
parseString(xml, function (err, result) {
	console.dir(result);
});

// 変換optionsを指定
parseString(xml, {trim: true}, function (err, result) {
	console.dir(result);
});
