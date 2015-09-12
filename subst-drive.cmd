@if "%~d0" == "P:" goto end
@set HERE=%~dp0
@set HERE=%HERE:~0,-1%
subst P: %HERE%
@explorer P:
@:end
@pause
