function showTypes(callback) {
	get('http://cloudup.com', function (err, res) {
		if (err) return callback(err);
		var done;
		var urls = links(res.text);
		var pending = urls.length;
		var results = new Array(pending);
		urls.forEach(function(url, i){
			get(url, function (err, res){
				if (done) return;
				if (err) return done = true, callback(err);
				results[i] = res.header['content-type'];
				--pending || callback(null, results);
			});
		});
	});
}

showTypes(function (err, types) {
	if (err) throw err;
	console.log(types);
});
