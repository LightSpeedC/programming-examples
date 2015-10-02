//
// node.jsのイベントループの問題点の実証コード
//
// 1) node example01.js と起動
// 2) http://127.0.0.1:8000/99999999/ にアクセス
// 3) http://127.0.0.1:8000/1/ にアクセス
//
// 1、3、2の順番だとブロックされないが、1、2、3の順番だと軽い処理の(3)がブロックされる
//

var http = require('http');
http.createServer(function (req, res) {
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
console.log('Access to http://127.0.0.1:8000/99999999/ first!');
console.log('Access to http://127.0.0.1:8000/1/ next!');
