@for /f "delims==" %%i in ('set') do @call :sub %%i
@goto end
@:sub
@set zzz=%%%1%%
@for /f "delims=" %%j in ('echo "%zzz%"') do @echo %1=%%j
@:end
