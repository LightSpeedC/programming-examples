@set HERE=%~dp0
@pushd %HERE%
@if not exist node_modules call npm install
@if not exist nodex.exe copy ..\nodejs\node.exe nodex.exe
@echo "" > %HERE%nvm_out.cmd
@%HERE%nodex %HERE%nvm.js %*
@node -v
@call %HERE%nvm_out
@del %HERE%nvm_out.cmd
@popd
