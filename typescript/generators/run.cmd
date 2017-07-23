@set RUN_CMD=
@if "%RUN_CMD%" == "" if exist .\node_modules\.bin\%1           set RUN_CMD=.\node_modules\.bin\
@if "%RUN_CMD%" == "" if exist ..\node_modules\.bin\%1          set RUN_CMD=..\node_modules\.bin\
@if "%RUN_CMD%" == "" if exist ..\..\node_modules\.bin\%1       set RUN_CMD=..\..\node_modules\.bin\
@if "%RUN_CMD%" == "" if exist ..\..\..\node_modules\.bin\%1    set RUN_CMD=..\..\..\node_modules\.bin\
@if "%RUN_CMD%" == "" if exist ..\..\..\..\node_modules\.bin\%1 set RUN_CMD=..\..\..\..\node_modules\.bin\
@node -e "process.stdout.write('\x1b[90m$ %RUN_CMD:\=\\%\x1b[m%*\r\n\x1b[36m')"
@call %RUN_CMD%%*
@node -e "process.stdout.write('\x1b[m')"
