dir /b *.cmd > tmp-file.log
@echo ****************************************************************
for /f %%f in (tmp-file.log) do @call :sub %%f
@echo ****************************************************************
for /f %%f in (tmp-file.log) do @echo y: %%f
@echo ****************************************************************
del tmp-file.log
@goto end
@:sub
@echo x: %1
@:end
