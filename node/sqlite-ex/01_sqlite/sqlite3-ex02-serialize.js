// @ts-check

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./test.db');
db.on('trace', (...data) => console.log('trace', data));
db.on('profile', (...data) => console.log('profile', data));

db.serialize(() => {
	db.run('drop table if exists members');
	db.run('create table if not exists members(name,age)');
	db.run('insert into members(name,age) values(?,?)', 'hoge', 33);
	db.run('insert into members(name,age) values(?,?)', 'foo', 44);
	db.run('update members set age = ? where name = ?', 55, 'foo');
	db.each('select * from members', (err, row) => {
		if (err) console.log(err);
		else console.log(`${row.name} ${row.age}`);
	});
	db.all('select * from members', (err, rows) => {
		if (err) console.log(err);
		else console.log(JSON.stringify(rows));
	});
	db.get('select count(*) from members', (err, count) => {
		if (err) console.log(err);
		else console.log(count['count(*)']);
	})
});

db.close();
