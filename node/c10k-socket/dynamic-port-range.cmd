netsh int ipv4 show dynamicport tcp
netsh int ipv4 set dynamicport tcp start=49152 num=16384
netsh int ipv4 show dynamicport tcp
pause
rem netsh int ipv4 set dynamicport tcp start=32768 num=32767
rem netsh int ipv4 set dynamicport tcp start=16384 num=49151
rem netsh int ipv4 set dynamicport tcp start=8192 num=57343
rem netsh int ipv4 set dynamicport tcp start=4096 num=61439
rem netsh int ipv4 set dynamicport tcp start=2048 num=63487
netsh int ipv4 set dynamicport tcp start=1025 num=64510
netsh int ipv4 show dynamicport tcp
pause
