@rem file set
for %%i in (a b c d e) do @echo %%i
for %%i in (a,b,c,d,e) do @echo %%i
for %%i in (*) do @echo %%i
@
@rem directory set
for /d %%i in (..\*) do @echo %%i
@
@rem recursive directory set
for /r . %%i in (*) do @echo %%i
for /r . %%i in (.) do @echo %%i
