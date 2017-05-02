'use strict';

const mongodb = require('mongodb');
const aa = require('aa');

aa(function *() {
	console.log('connect...');
	const db = yield cb => mongodb.MongoClient.connect(
			process.env.MONGO_URL || 'mongodb://localhost:27017/test', cb);

	const tasks = db.collection('tasks');

	console.log('find...');
	const result = yield cb => tasks.find().toArray(cb);
	console.log(result);
	console.log(JSON.stringify(result));
	console.log('close...');
	yield cb => db.close(cb);
	console.log('end...');
});
