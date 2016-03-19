'use strict'

const http = require('http');
const fs   = require('fs');
const ws   = require('websocket.io');

const view = fs.readFileSync('views/index.html');

// http サーバで初期画面を取得できるようにする
const server = http.createServer(function (req, res) {
  res.end(view);
});

let master = null;

// websocket サーバを構築する
const wserver = ws.listen(8888);

wserver.on('connection', socket => {
  // masterが存在しなければ、コネクション成立したものをmasterにする
  if (master === null) {
    master = socket;
    socket.send('master');
  }

  socket.on('message', data => {
    if (socket != master) return false;// master以外が情報を送信する権限はない
    wserver.clients.forEach(client => {
      if (client != master) client.send(data);// master以外の運動状態を送信
    });
  });

  socket.on('close', () => {
    if (socket === master) {
      master = null;
    }
  })
});

server.listen(3000);
