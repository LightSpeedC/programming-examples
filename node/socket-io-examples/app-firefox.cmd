@set ff1=C:\Program Files\Mozilla Firefox\firefox.exe
@set ff2=C:\Program Files (x86)\Mozilla Firefox\firefox.exe
@if exist "%ff1%" (
	start "GP-WAN" "%ff1%" http://localhost:3000
	goto ok)
@if exist "%ff2%" (
	start "GP-WAN" "%ff2%" http://localhost:3000
	goto ok)
@start http://localhost:3000
@:ok
@node socket-io-server
@pause
