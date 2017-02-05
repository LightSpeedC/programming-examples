'use strict';
const http = require('http'), url = require('url'), net  = require('net');
const HTTP_PORT = process.argv[2] || 8080;  // internal proxy server port
const PROXY_URL = process.argv[3] || null;  // external proxy server URL
const PROXY_HOST = PROXY_URL ?  url.parse(PROXY_URL).hostname    : null;
const PROXY_PORT = PROXY_URL ? (url.parse(PROXY_URL).port || 80) : null;

const server = http.createServer(function onCliReq(cliReq, cliRes) {
  let svrSoc;
  const cliSoc = cliReq.socket, x = url.parse(cliReq.url);
  const svrReq = http.request({host: PROXY_HOST || x.hostname,
      port: PROXY_PORT || x.port || 80,
      path: PROXY_URL ? cliReq.url : x.path,
      method: cliReq.method, headers: cliReq.headers,
      agent: cliSoc.$agent}, function onSvrRes(svrRes) {
    svrSoc = svrRes.socket;
    cliRes.writeHead(svrRes.statusCode, svrRes.headers);
    svrRes.pipe(cliRes);
  });
  cliReq.pipe(svrReq);
  svrReq.on('error', function onSvrReqErr(err) {
    cliRes.writeHead(400, err.message, {'content-type': 'text/html'});
    cliRes.end('<h1>' + err.message + '<br/>' + cliReq.url + '</h1>');
    onErr(err, 'svrReq', x.hostname + ':' + (x.port || 80), svrSoc);
  });
})
.on('clientError', (err, soc) => onErr(err, 'cliErr', '', soc))
.on('connect', function onCliConn(cliReq, cliSoc, cliHead) {
  const x = url.parse('https://' + cliReq.url);
  let svrSoc;
  if (PROXY_URL) {
    const svrReq = http.request({host: PROXY_HOST, port: PROXY_PORT,
        path: cliReq.url, method: cliReq.method, headers: cliReq.headers,
        agent: cliSoc.$agent});
    svrReq.end();
    svrReq.on('connect', function onSvrConn(svrRes, svrSoc2, svrHead) {
      svrSoc = svrSoc2;
      cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
      if (cliHead && cliHead.length) svrSoc.write(cliHead);
      if (svrHead && svrHead.length) cliSoc.write(svrHead);
      svrSoc.pipe(cliSoc);
      cliSoc.pipe(svrSoc);
      svrSoc.on('error', err => onErr(err, 'svrSoc', cliReq.url, cliSoc));
    });
    svrReq.on('error', err => onErr(err, 'svrRq2', cliReq.url, cliSoc));
  }
  else {
    svrSoc = net.connect(x.port || 443, x.hostname, function onSvrConn() {
      cliSoc.write('HTTP/1.0 200 Connection established\r\n\r\n');
      if (cliHead && cliHead.length) svrSoc.write(cliHead);
      cliSoc.pipe(svrSoc);
    });
    svrSoc.pipe(cliSoc);
    svrSoc.on('error', err => onErr(err, 'svrSoc', cliReq.url, cliSoc));
  }
  cliSoc.on('error', err => onErr(err, 'cliSoc', cliReq.url, svrSoc));
})
.on('connection', function onConn(cliSoc) {
  cliSoc.$agent = new http.Agent({keepAlive: true});
  cliSoc.$agent.on('error', err => console.log('agent:', err));
})
.listen(HTTP_PORT, () =>
  console.log('http proxy server started on port ' + HTTP_PORT +
    (PROXY_URL ? ' -> ' + PROXY_HOST + ':' + PROXY_PORT : '')));

function onErr(err, msg, url, soc) {
  if (soc) soc.end();
  console.log('%s %s: %s', new Date().toLocaleTimeString(), msg, url, err + '');
}
