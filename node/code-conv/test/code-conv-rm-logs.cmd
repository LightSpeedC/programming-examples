rem çÌèú
set LOGDIR=%~dp0code-conv-logs
if exist "%LOGDIR%" del /s /q "%LOGDIR%\*.*"
if exist "%LOGDIR%" rmdir "%LOGDIR%"
