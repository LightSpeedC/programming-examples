// ���W���[�����[�h
var fs = require('fs');
var parser = require('xml2json');

// xml����json�ɕϊ�����
//var xml = fs.readFileSync('rss.xml', 'utf-8');
var xml = '<user scholl="3" class="11">a<name>mike</name>b<age>19</age>c</user>';
console.log(xml);
var json = parser.toJson(xml);
console.dir(JSON.parse(json));

// xml����json�ɕϊ�����
//parser.toJson(xml, options);

// json����xml�ɕϊ�����
//parser.toXml(json, otpions);

