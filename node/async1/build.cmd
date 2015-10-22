@if not exist node_modules call npm install
call babel a.js > a.es6to5.js
call babel b.js > b.es6to5.js
@pause
