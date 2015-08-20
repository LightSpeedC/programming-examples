if not exist node_modules call npm install
start iojs app 3001
timeout /t 3
start http://localhost:3001
