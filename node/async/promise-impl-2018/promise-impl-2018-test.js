'use strict';

const PromiseImpl = require('./promise-impl-2018');

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
