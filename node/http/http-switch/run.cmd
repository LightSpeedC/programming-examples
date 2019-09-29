pushd %~dp0
start run-and-wait node http-server-test 8000
start run-and-wait node http-switch
start http://localhost:8001/test
start http://localhost:8000/test
pause
popd
