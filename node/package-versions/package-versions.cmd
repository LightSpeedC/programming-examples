@if not exist node_modules call npm install
@pushd %~dp0
@set ROOT_DIR=%1
@if "%ROOT_DIR%" == "" set ROOT_DIR=..\..\..\..
node package-versions %ROOT_DIR%
@popd
@pause
