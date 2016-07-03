// http://qiita.com/notsunohito/items/15c528509de8dc5927bf

function sleep(ms) {
  return new Promise((resolve)=> {
    setTimeout(()=> {
      resolve();
    }, ms)  
  })
}

class Human {
  async sayHello() {
    await sleep(1000);
    console.log('hello')
    return this;
  }
  async sayBye() {
    await sleep(1000);
    console.log('bye');
    return this;
  }
}


(async ()=> {
  await (await new Human().sayHello()).sayBye();
})();
// => helloしか出力されない

Promise.all([
  (async () => {
    await sleep(3000);
    console.log('x1');
    await sleep(1000);
    console.log('x2');
  })(),
  (async () => {})()
]);
