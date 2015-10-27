(function () {
	var pg = require('pg');
	var Promise = require('promise-light');

	var pgpromise = {
		pg: pg,
		Client: function Client(connStr) {
			var ctx = this;
			var client = new pg.Client(connStr);

			this.connect = function connect() {
				return new Promise(function (resolve, reject) {
					client.connect(function (err) {
						if (err) return reject(err);
						resolve();
					}); // client.connect
				}); // return new Promise()
			}; // connect

			this.query = function query(sql, params) {
				return new Promise(function (resolve, reject) {
					client.query(sql, params, function (err, result) {
						if (err) return reject(err);
						resolve(result);
					}); // client.query
				}); // return new Promise()
			}; // query

			this.end = client.end.bind(client);

		}, // Client
		connect: function connect(connStr) {
			var ctx = this;
			return new Promise(function (resolve, reject) {
				ctx.pg.connect(connStr, function (err, client, done) {
					if (err) return reject(err);
					resolve({
						client: client,
						done: done,
						query: function query(sql, params) {
							return new Promise(function (resolve, reject) {
								client.query(sql, params, function (err, result) {
									if (err) return reject(err);
									resolve(result);
								});
							}); // return new Promise()
						}, // query
					}); // resolve
				}); // pg.connect
			}); // return new Promise()
		}, // connect
		end: pg.end.bind(pg),
	}; // pgpromise

	module.exports = pgpromise;

})();
