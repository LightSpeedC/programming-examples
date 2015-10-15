@if not exist node_modules call npm install
@pushd %~dp0
@set GIT_ROOT_DIR=%1
@if "%GIT_ROOT_DIR%" == "" set GIT_ROOT_DIR=..\..\..\..
node git-pull %GIT_ROOT_DIR%
@popd
@pause
