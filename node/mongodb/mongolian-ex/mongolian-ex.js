var mongolian = require('mongolian');
var db = new mongolian(process.env.MONGO_URL || 'mongo://localhost/test');
//var db = new mongolian('mongo://user:pwd@localhost:27000/test');
db.collection('deals').insert({deal: 'deal', tags:'a,b,c'.split(',')});
