// Koa application. 
const koa = require('koa');
const app = koa();

/*
app.use(function *(next) {
	try {
		yield next;
	} catch (err) {
		this.body = {message: err.message};
		this.status = err.status || 500;
	}
});

app.use(function *() {
	const user = yield User.getById(this.session.userid);
	this.body = user;
});
*/

// x-response-time
app.use(function *(next){
	const start = new Date;
	yield next;
	const ms = new Date - start;
	this.set('X-Response-Time', ms + 'ms');
});

// logger
app.use(function *(next){
	const start = new Date;
	yield next;
	const ms = new Date - start;
	console.log('%s %s - %s', this.method, this.url, ms);
});

// response
app.use(function *(){
	this.body = 'Hello World';
});

// listen
app.listen(3000);

/*
const koa = require('koa');
const app = koa();
app.listen(3000);
*/

/*
const http = require('http');
const koa = require('koa');
const app = koa();
http.createServer(app.callback()).listen(3000);
*/

/*
const http = require('http');
const koa = require('koa');
const app = koa();
http.createServer(app.callback()).listen(3000);
http.createServer(app.callback()).listen(3001);
*/

/*
app.on('error', function(err){
	log.error('server error', err);
});
app.on('error', function(err, ctx){
	log.error('server error', err, ctx);
});
*/

/*
app.use(function *(){
	this; // is the Context
	this.request; // is a koa Request
	this.response; // is a koa Response
});
*/
