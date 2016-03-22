pushd %~dp0
start python -m SimpleHTTPServer 8000
timeout /t:3
call web-client-tree
pause
popd
