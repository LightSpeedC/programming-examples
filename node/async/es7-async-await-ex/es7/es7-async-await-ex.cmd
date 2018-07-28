@set BASENAME=es7-async-await-ex
@if not exist node_modules call npm up -S
@echo $ babel      %BASENAME%.js     -o %BASENAME%.es5.js
@call babel %BASENAME%.js -o %BASENAME%.es5.js
@echo $ browserify %BASENAME%.es5.js -o %BASENAME%.browser.js
@call browserify %BASENAME%.es5.js -o %BASENAME%.browser.js
@echo $ node       %BASENAME%.es5.js
@node %BASENAME%.es5.js
@pause
