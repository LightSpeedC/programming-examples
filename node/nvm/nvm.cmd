@set HERE=%~dp0
@echo "" > %HERE%nvm_out.cmd
@%HERE%nodex %HERE%nvm.js %*
@node -v
@call %HERE%nvm_out
@del %HERE%nvm_out.cmd
