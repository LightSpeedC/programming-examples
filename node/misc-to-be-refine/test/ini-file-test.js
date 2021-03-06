/* ini-file-test.js */

var util = require('util');

var IniFile = require('ini-file');

function check(obj) {
  var strIniFile = IniFile.toIniFile(obj);
  var result = IniFile.parseIniFile(strIniFile);
  console.log('\033[5m' + strIniFile + '\033[m' +
    util.inspect(result, false, null, true));
  var ok = (JSON.stringify(result) === JSON.stringify(obj));

  if (ok)
    console.log('\033[92;42mOK\033[m');
  else
    console.log('\033[91;41mERROR!!\033[m');
  console.log();
}

var obj = {
  header: {nn: null, n1: 1, n2: 1.2, snn: 'null', sn1: '1', sn2: '1.2',
    b1: true, b2: false, sb1: 'true', sb2: 'false',
    ss1: 'B', ss2: ' C', ss3: 'C ', ss4: ' " \r\n '},
  data: {
    xml: '<xml>data</xml>',
    pdf:{protocol:'file',location:'c:/a.pdf'}}};

check(obj);
check(123);
check(1.2);
check(true);
check(false);
check(undefined);
check(null);

IniFile.setSectionSeparator('/');
check(obj);
