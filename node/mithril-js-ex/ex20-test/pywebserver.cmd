pushd %~dp0
cd ..
start http://localhost:8002/ex20-test/
start python -m SimpleHTTPServer 8002
pause
