if not exist node_modules call npm install
@rem (Linux) DEBUG=myapp ./bin/www
set DEBUG=ex02-express-jade:* & node .\bin\www
