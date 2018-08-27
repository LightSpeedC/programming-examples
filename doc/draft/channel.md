# Channel

## minimum channel

```js
const channel = Channel();
channel(error, result); // send
channel((error, result) => {}); // receive
channel((...args) => {}); // receive
```

## channel like promise

```js
channel.then(onFulfilled, onRejected); // receive
channel.catch(onRejected); // receive
```

## channel like stream

```js
channel.on(event, listener); // (stream)
channel.once(event, listener); // (stream)
channel.write(result); // send (stream)
channel.end(); // send (stream)
channel.pipe(stream); // (stream)
```

## other channel

```js
channel.resolve(result); // send (like promise? -> NG)
channel.reject(error) // send (like promise? -> NG)
channel.next(result); // send (like generators? -> NG)
channel.throw(error) // send (like generators? -> NG)
```
