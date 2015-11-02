@echo off
set HERE=%~dp0
pushd %HERE%
set NVM_TMP=nvm-tmp.cmd
node -e "process.stdout.write('copy ')" > %NVM_TMP%
where node >> %NVM_TMP%
node -e "process.stdout.write('.\nodex.exe')" >> %NVM_TMP%
type %NVM_TMP%
popd
