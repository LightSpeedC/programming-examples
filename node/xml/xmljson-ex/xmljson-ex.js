var to_json = require('xmljson').to_json;
 
//XML��������쐬
var xml = '<myData>' +
            'a<tag1>value1</tag1>' +
            'b<tag2>value2</tag2>' +
            'c<tag3>value3</tag3>' +
          '</myData>';
 
to_json(xml, function (error, data) {
    console.log(data);
    // -> { myData: { tag1: 'value1', tag2: 'value2', tag3: 'value3' } }
});




var to_xml = require('xmljson').to_xml;
 
//JS�I�u�W�F�N�g���쐬
var obj = {
 name:"myobject",
 child:{
   name:"child object",
   type:"object"
 }
};
 
//�I�u�W�F�N�g��JSON������ɕϊ�
var json = JSON.stringify(obj);
 
to_xml(json, function (error, xml) {
    console.log(xml);
    // -> <data><name>myobject</name><child><name>child object</name><type>object</type></child></data>
});
