@if "%~d0" == "N:" goto end
@set HERE=%~dp0
@set HERE=%HERE:~0,-1%
subst N: %HERE%
@explorer N:
@:end
@pause
