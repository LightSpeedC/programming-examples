if not exist node_modules call npm install
@rem (Linux) DEBUG=myapp ./bin/www
set DEBUG=ex03-express-ejs:* & node .\bin\www
