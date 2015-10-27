(function () {
	var pg = require('pg');

	var pgpromise = {
		pg: pg,
		Client: function Client(connStr) {
			var ctx = this;
			var client = new pg.Client(connStr);

			this.connect = function connect() {
				return function (cb) {
					client.connect(function (err) {
						if (err) return cb(err);
						cb(null);
					}); // client.connect
				}; // return thunk
			}; // connect

			this.query = function query(sql, params) {
				return function (cb) {
					client.query(sql, params, function (err, result) {
						if (err) return cb(err);
						cb(null, result);
					}); // client.query
				}; // return thunk
			}; // query

			this.end = client.end.bind(client);

		}, // Client
		connect: function connect(connStr) {
			var ctx = this;
			return function (cb) {
				ctx.pg.connect(connStr, function (err, client, done) {
					if (err) return cb(err);
					cb(null, {
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
			}; // return thunk
		}, // connect
		end: pg.end.bind(pg),
	}; // pgpromise

	module.exports = pgpromise;

})();
