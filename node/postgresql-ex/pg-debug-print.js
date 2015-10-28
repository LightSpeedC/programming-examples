	[pg, pg.constructor.prototype, pg.Client.prototype].forEach((x, i) => Object.getOwnPropertyNames(x).forEach(p=>{
		try {
			console.log('pg %d %s [%s]', i, typeof x[p], p);
		} catch(e) {
			console.error('pg %d [%s]', i, p, e);
		}
	}));
