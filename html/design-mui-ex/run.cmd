if not exist node_modules call npm install
start node app 3003
timeout /t 3
start http://localhost:3003
