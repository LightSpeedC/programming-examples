set PORT=8000
start /b node here %PORT%
timeout /t 3 /nobreak
node -e console.log()
start http://localhost:%PORT%/check.html
start http://localhost:%PORT%/check2.html
pause
