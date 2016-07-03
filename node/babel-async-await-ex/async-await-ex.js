//require("babel-polyfill");
//require("regenerator-runtime/runtime");

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
