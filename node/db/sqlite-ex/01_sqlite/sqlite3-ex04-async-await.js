// @ts-check

const sqlite3 = require('sqlite3').verbose();

const startTime = Date.now();

main().catch(console.error);

function sqlitePromisify(obj) {
	// promisify methods for Database and Statement
	const methods = [
		'run', 'exec', 'get', 'all', 'each',
		'close', 'map', 'loadExtension',
		'bind', 'reset', 'finalize',
	];

	methods.forEach(key => {
		const func = obj[key];
		if (typeof func === 'function') {
			obj[key] = (...args) => new Promise((res, rej) => {
				try {
					func.apply(obj,
						[...args,
						(err, val) => err ? rej(err) : res(val)]);
				}
				catch (err) { rej(err); }
			});
		}
	});

	// prepare method of Database for Statement
	const prepare = obj.prepare;
	if (typeof prepare === 'function') {
		obj.prepare = (...args) => new Promise((res, rej) => {
			try {
				const stmt = sqlitePromisify(prepare.apply(obj,
					[...args, err => err ? rej(err) : res(stmt)]));
			}
			catch (err) { rej(err); }
		});
	}

	return obj;
}

function log(...args) {
	console.log(1000 + Date.now() - startTime, ...args);
}

async function main() {
	const db = sqlitePromisify(new sqlite3.Database('./test.db'));

	db.on('trace', (...data) => log('trace', data));
	db.on('profile', (...data) => log('profile', data));

	await db.run('drop table if exists members');
	await db.run('create table if not exists members(name,age)');
	log('=> nRows:', await db.each('select * from members', (err, row) => {
		db.interrupt();
		if (err) log(err);
		log(`-> ${row.name} ${row.age}`);
	}));
	await db.run('insert into members(name,age) values(?,?)', 'Kaz', 57);
	await db.run('insert into members(name,age) values(?,?)', 'Leo', 13);
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
