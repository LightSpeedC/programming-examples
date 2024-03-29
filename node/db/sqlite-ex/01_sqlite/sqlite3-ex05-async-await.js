// @ts-check

const sqlite3 = require('sqlite3').verbose();
const aaSqlite3 = require('aa-sqlite3');

const startTime = Date.now();

main().catch(err => console.error('=============\n', err));


function log(...args) {
	console.log(1000 + Date.now() - startTime, ...args);
}

async function main() {
	const db = aaSqlite3(new sqlite3.Database('./test.db'));

	// db.on('trace', sql => log('trace:', sql));
	db.on('profile', (sql, msec) => log('profile:', msec, sql));
	// db.on('profile', (sql, msec) => msec > 0 ? log('profile:', msec, sql) : null);

	await db.run('drop table if exists members');
	await db.run('create table if not exists members(name text, age integer)');
	// await db.run('create index if not exists members_ix01 on members(name)');
	log('=> nRows:', await db.each('select * from members', (err, row) => {
		db.interrupt();
		if (err) log(err);
		log(`-> ${row.name} ${row.age}`);
	}));
	await db.run('insert into members(name,age) values(?,?)', 'Kaz', 57);
	await db.run('insert into members(name,age) values(?,?)', 'Leo', 13);
	// for (let i = 1000; i < 2000; ++i)
	// 	await db.run('insert into members(name,age) values(?,?)', 'Name' + i, i - 1000);
	log('=> nRows:', await db.each('select * from members', (err, row) => {
		db.interrupt();
		if (err) log(err);
		else log(`-> ${row.name} ${row.age}`);
	}));

	log('->', await db.get('select * from members where name = $name', { $name: 'Leo' }));

	const rows = await db.all('select * from members');
	for (const row of rows) log('->', row);
	log('=>', rows.length);

	const stmt1 = await db.prepare('select * from members where name = $name');
	log(await stmt1.get({ $name: 'Leo' }));
	await stmt1.finalize();

	log('map:', await db.map('select * from members'));

	const stmt2 = await db.prepare('select * from members');
	log(await stmt2.all());
	await stmt2.finalize();

	const stmt3 = await db.prepare('select * from members where name = $name');
	await stmt3.bind({ $name: 'Leo' });
	log('all:', await stmt3.all());
	await stmt3.finalize();

	log('db.close');
	await db.close();
}
