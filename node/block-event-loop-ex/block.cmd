start node block
timeout /t:3
start http://127.0.0.1:8000/1/
timeout /t:3
start http://127.0.0.1:8000/99999999/
timeout /t:3
start http://127.0.0.1:8000/1/
pause
