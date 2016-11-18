http=require('http');
http.createServer((req,res)=>res.end('http port 8888 servicing...'))
.listen(8888);
