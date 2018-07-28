@set BASENAME=es6-stream-ex
@if not exist node_modules call npm up -S
@node %BASENAME%.js
@echo $ babel      %BASENAME%.js    -o %BASENAME%.es5.js
@call babel %BASENAME%.js -o %BASENAME%.es5.js
@echo $ browserify %BASENAME%.es5.js -o %BASENAME%.browser.js
@call browserify %BASENAME%.es5.js -o %BASENAME%.browser.js
@echo $ browserify require-runtime.js -o runtime.js
@call browserify require-runtime.js -o runtime.js
@echo $ node       %BASENAME%.es5.js
@pause
