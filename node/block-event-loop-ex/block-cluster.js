//
// node.jsのイベントループの問題点の実証コード
//
// 1) node example01.js と起動
// 2) http://127.0.0.1:8000/99999999/ にアクセス
// 3) http://127.0.0.1:8000/1/ にアクセス
//
// 1、3、2の順番だとブロックされないが、1、2、3の順番だと軽い処理の(3)がブロックされる
//
var cluster = require('cluster');
var http = require('http');
var numCPUs = 20; //require('os').cpus().length;

if (cluster.isMaster) {
	console.log('numCPUs:', numCPUs);

	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', function (worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});

	console.log('Access to http://127.0.0.1:8000/99999999/ first!');
	console.log('Access to http://127.0.0.1:8000/1/ next!');

	return;
}

console.log('worker:', cluster.worker.id);

http.createServer(function (req, res) {
	console.log('request:', cluster.worker.id);
	res.writeHead(200, {'Content-Type': 'text/plain'});

	var parsed = require('url').parse(req.url);
	var re = new RegExp('^/([0-9]+)');
	if(parsed.pathname.match(re)){
		var number = RegExp.$1;
		function calc(a, b){
			for(var c = 0; c < b; c++)
				a += 1 - 2 * (c % 2);
			return a;
		}
		var n = 0, c;
		for(c = 0; c < number; c++){
			n = calc(n, c);
		}
		res.write("Result: " + n);
		res.end();
	}

	res.end();
}).listen(8000);
