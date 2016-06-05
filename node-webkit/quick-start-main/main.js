// package.jsonのwindowオプションの初期値を取り込む
const options = require('./package.json').window || {};

// Windowを開く
nw.Window.open('index.html', options);
