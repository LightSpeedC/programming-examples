aa 仕様
====

```js
const aa = require('aa-yocto');
```

aa(any) return promise.

* aa() ... return new Channel()
* aa(gtor | gtor-func | async-func | thunk-func) ... do it
* aa(array | object) ... resolve all
* aa(promise) ... return it
* aa(undefined | null | number | string | boolean | other) ... resolve it
* aa(stream) ... consume it

* aa.Channel() ... return new Channel()
* aa.wait(msec: number, [value: any]) ... wait
