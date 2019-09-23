// モジュールロード
var fs = require('fs');
var parser = require('xml2json');

// xmlからjsonに変換する
//var xml = fs.readFileSync('rss.xml', 'utf-8');
var xml = '<user scholl="3" class="11">a<name>mike</name>b<age>19</age>c</user>';
console.log(xml);
var json = parser.toJson(xml);
console.dir(JSON.parse(json));

// xmlからjsonに変換する
//parser.toJson(xml, options);

// jsonからxmlに変換する
//parser.toXml(json, otpions);

