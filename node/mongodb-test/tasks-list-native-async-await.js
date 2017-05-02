'use strict';

const mongodb = require('mongodb');

main();

async function main() {
	const db = await new Promise((res, rej) =>
		mongodb.MongoClient.connect(
			process.env.MONGO_URL || 'mongodb://localhost:27017/test',
			(err, val) => err ? rej(err) : res(val)));

	const tasks = db.collection('tasks');
	const result = await new Promise((res, rej) =>
		tasks.find().toArray((err, val) => err ? rej(err) : res(val)));

	console.log(result);
}
