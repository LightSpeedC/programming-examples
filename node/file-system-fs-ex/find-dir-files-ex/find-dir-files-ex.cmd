@echo %%~dp0 = %~dp0
@echo %%cd%% = %cd%
@echo %%* = %*
@set dir=%*
@if "%dir:~-1%" == "\" @set dir=%dir%\
@set /p text=テキスト?
node %~dp0find-dir-files-ex "%dir%" "%text%"
@pause
