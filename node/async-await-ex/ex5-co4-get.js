function showTypes(fn) {
	co(function *(){
		var res = yield get('http://cloudup.com')
		var responses = yield links(res.text).map(get)
		return responses.map(res => res.headers['content-type'])
	}).then(res => fn(null, res), err => fn(err))
}
