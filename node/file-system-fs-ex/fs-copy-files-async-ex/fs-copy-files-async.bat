pushd %~dp0
pause
mkdir copy
node %~dpn0 C:\ copy
popd
pause
