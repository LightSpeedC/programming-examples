set HERE=%~dp0
if not exist %HERE%\data mkdir %HERE%\data
if not exist %HERE%\logs mkdir %HERE%\logs
mongod --storageEngine=mmapv1 --nojournal --dbpath %HERE%\data --logpath %HERE%\logs\mongodb.log
pause
