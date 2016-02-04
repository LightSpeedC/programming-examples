@pushd %~dp0
@node -p '\x1b[44m' & cls
node a %*
@popd
@node -p '\x1b[41m'
@pause
