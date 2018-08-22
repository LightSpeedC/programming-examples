async interface
====

* Node.js Callback Style
* Promise Style
* Stream Style
* Event Emiiter Style
* Thunk Style

# Node.js Callback Style

## interface (error, value) => void

```js
const cb = (err, val) => undefined;

functionWithNodeStyleCallback(..., cb);

function functionWithNodeStyleCallback(arg0, arg1, arg2, cb) {
	// cb(err, val) asynchronously called
	return;
}
```


# Promise Style

```js
new Promise(setup).then(...).catch(...).finally(...);

class Promise {
	then(resolved, rejected) {}
	catch(rejected) {}
	finally(finished) {}
}
```

# Stream Style

```js
class Stream {
	pipe(stream) {}
	on(event, listener) {}
}
```

# Event Emiiter Style

```js
class EventEmitter {
	on(event, listener) {}
	emit(event, args) {}
}
```

# Thunk Style

Nodeコールバックスタイルを引数に持つ関数を返す。

```js
function thunk(args) {
	return cb => { cb(err, val); };
}
```
