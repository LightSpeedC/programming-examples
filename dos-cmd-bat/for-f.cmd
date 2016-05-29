for                           %%i in              (a b c d e)  do @echo %%i
for                           %%i in              (a,b,c,d,e)  do @echo %%i
for /f "usebackq tokens=1-3"  %%i in             ('a b c d e') do @echo %%i,%%j,%%k
for /f "usebackq tokens=1-3"  %%i in             ('a,b,c,d,e') do @echo %%i,%%j,%%k
for /f          "tokens=1-2*" %%i in       ('@echo a b c d e') do @echo %%i,%%j,%%k
for /f          "tokens=1-2*" %%i in       ('@echo a,b,c,d,e') do @echo %%i,%%j,%%k
for /f "usebackq tokens=1-5"  %%i in       (`@echo a b c d e`) do @echo %%i %%j %%k %%l %%m
for /f "usebackq tokens=1-5"  %%i in       (`@echo a,b,c,d,e`) do @echo %%i %%j %%k %%l %%m
for /f                        %%i in ('@node -p """a,b,c"""')  do @echo %%i
for /f                        %%i in ('dir /b')                do @echo %%i
