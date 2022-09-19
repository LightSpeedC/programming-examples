// @ts-check

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./test.db');
db.on('trace', (...data) => console.log('trace', data));
db.on('profile', (...data) => console.log('profile', data));

db.run('drop table if exists members');
db.run('create table if not exists members(name,age)');
// 非同期なので完了する前に以下のinsertが実行される事がある
db.run('insert into members(name,age) values(?,?)', 'hoge', 33);
db.run('insert into members(name,age) values(?,?)', 'foo', 44);
db.each('select * from members', (err, row) => {
	if (err) console.log(err);
	else console.log(`${row.name} ${row.age}`);
});

db.close();
