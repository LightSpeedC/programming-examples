if not exist node_modules call npm install
start iojs app 3006
timeout /t 3
start http://localhost:3006
