const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const routes = {
	GET: {
		'/': (req, res) => resHtml(res, 200, '/ -> index.html'),
		'/tasks.json': (req, res) => resSendJsonFile(res, 200, 'tasks.json', '{}'),
	},
	POST: {
		'/tasks.json': (req, res) => postFile(req, res, 'tasks.json'),
	}
};

const server = http.createServer((req, res) => {
	const route = routes[req.method] && routes[req.method][req.url];
	if (route) return route(req, res);
	resText(res, 404, 'Error: ' + req.method + ' ' + req.url);
});

// listen
server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

// response send text
function resSend(res, statusCode, headers, text) {
	res.writeHead(statusCode, headers);
	res.end(text);
}

// response send json file
function resSendJsonFile(res, statusCode, fileName, errResult) {
	resSendFile(res, statusCode, {'Content-Type': 'application/json'}, fileName, errResult);
}

// response send file
function resSendFile(res, statusCode, headers, fileName, errResult) {
	fs.readFile(fileName, (err, result) => {
		if (err) {
			if (errResult)
				resSend(res, statusCode, headers, errResult);
			else
				resText(res, 404, 'Error: ' + err);
		}
		else
			resSend(res, statusCode, headers, result);
	});
}

// post file
function postFile(req, res, fileName) {
	const w = fs.createWriteStream(fileName);
	req.pipe(w);
	resText(res, 200, 'OK');
}

// response html
function resHtml(res, statusCode, html) {
	return resSend(res, statusCode, {'Content-Type': 'text/html'}, html);
}

// response text
function resText(res, statusCode, text) {
	return resSend(res, statusCode, {'Content-Type': 'text/plain'}, text);
}
