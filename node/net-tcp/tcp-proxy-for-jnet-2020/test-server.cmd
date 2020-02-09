@echo off
echo テストサーバ
pushd %~dp0
node test-server
popd
pause
