'use strict';

class PromiseImpl {

	constructor(resolver) {
		if (typeof resolver !== 'function')
			throw new TypeError('Promise resolver ' + resolver + ' is not a function');

		const prom = this;
		this.ary = [];
		let error, result;
		let state = 'pending';
		let progress = false;
		resolver(res, rej);

		function res(val) {
			if (state !== 'pending') return;
			state = 'resolved';
			result = val;
			if (progress) return;
			progress = true;
			setTimeout(after, 0, prom);
		}

		function rej(err) {
			if (state !== 'pending') return;
			state = 'rejected';
			error = err;
			if (progress) return;
			progress = true;
			setTimeout(after, 0, prom);
		}

		function after(prom) {
			let entry;
			while (entry = prom.ary.shift()) {
				try {
					let next;
					if (error) {
						if (entry[1]) {
							next = entry[1](error);
							if (next && typeof next.then === 'function')
								next.then(entry[2], entry[3]);
							else
								entry[2](next);
						}
						else
							entry[3](error);
					}
					else {
						next = entry[0] ? entry[0](result) : result;
						if (next && typeof next.then === 'function')
							next.then(entry[2], entry[3]);
						else
							entry[2](next);
					}
				} catch (err) {
					entry[3](err);
				}
			}
			progress = false;
		}

	}

	then(onRes, onRej) {
		if (onRes && typeof onRes !== 'function')
			throw new TypeError('Promise onFulfilled ' + onRes + ' is not a function');
		if (onRej && typeof onRej !== 'function')
			throw new TypeError('Promise onRejected ' + onRej + ' is not a function');

		let nextRes, nextRej;
		const p = new PromiseImpl((res, rej) => (nextRes = res, nextRej = rej));
		this.ary.push([onRes, onRej, nextRes, nextRej]);
		return p;
	}

	catch(onRej) {
		if (onRej && typeof onRej !== 'function')
			throw new TypeError('Promise onRejected ' + onRej + ' is not a function');

		return this.then(undefined, onRej);
	}

	finally(onFin) {
		if (typeof onFin !== 'function')
			throw new TypeError('Promise onFinished ' + onFin + ' is not a function');

		this.then(() => onFin(), () => onFin());
		return this;
	}

	static resolve(result) {
		return new PromiseImpl((res, rej) => res(result));
	}

	static reject(error) {
		return new PromiseImpl((res, rej) => rej(error));
	}

}

new PromiseImpl((res, rej) => {
	rej(110);
})
.then(v => (console.log('a1:', v), 'a1'))
.catch(e => { console.log('a3:', e); throw 'a3'; })
.then(v => console.log('a5:', v), e => console.log('a6:', e))
.finally(() => console.log('a9: finally'));

new Promise((res, rej) => {
	rej(210);
})
.then(v => (console.log('b1:', v), 'b1'))
.catch(e => { console.log('b3:', e); throw 'b3'; })
.then(v => console.log('b5:', v), e => console.log('b6:', e))
.then(() => console.log('b9: finally'), () => console.log('b9: finally'))
