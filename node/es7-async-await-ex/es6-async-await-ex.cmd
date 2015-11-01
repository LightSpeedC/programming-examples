@set BASENAME=es6-async-await-ex
@if not exist node_modules call npm up -S
@node %BASENAME%.js
@echo $ babel      %BASENAME%.js       %BASENAME%.es5.js
@call babel %BASENAME%.js > %BASENAME%.es5.js
@echo $ browserify %BASENAME%.es5.js   %BASENAME%.browser.js
@call browserify %BASENAME%.es5.js > %BASENAME%.browser.js
@echo $ browserify require-runtime.js   runtime.js
@call browserify require-runtime.js > runtime.js
@echo $ node       %BASENAME%.es5.js
@pause
