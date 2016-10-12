start python -m SimpleHTTPServer 8001
start python -m SimpleHTTPServer 8002
start http://test1.testdomain.com:8001/test1-main.html
@rem start http://localhost:8001
if not "paused" == "%paused%" (pause && set paused=paused)
