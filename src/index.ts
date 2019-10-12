var path = require('path');
var app = require('./server');
var dotEnvOption = {};
var mode = '';

if ( process.argv.findIndex(o=>o.search(/prod/i)>=0) >= 0 ) {
    mode = 'PRODUCTION'
    dotEnvOption = {
        path: path.resolve(process.cwd(), './.prod.env')
    }
} else if ( process.argv.findIndex(o=>o.search(/dev/i)>=0) >= 0 ) {
    mode = 'DEVELOPMENT'
    dotEnvOption = {
        path: path.resolve(process.cwd(), './.dev.env')
    }
} else {
    mode = 'DEVELOPMENT'
    dotEnvOption = {
        path: path.resolve(process.cwd(), './.dev.env')
    }
}
require('dotenv').config(dotEnvOption);
var PORT = process.env.PORT || 3000;
var green = "\x1b[32m";
var white = "\x1b[37m";
var yellow = "\x1b[33m";
var magenta = "\x1b[35m";
var blue = "\x1b[34m";
app.default.listen(PORT, function() {
    console.log(`
========|${ blue + ' AUTHENTCATION SERVER ' + white }|=========
   PORT : ${ yellow + process.env.PORT + white }
   ENV  : ${ green + process.env.ENVIRONMENT + white }
   DB   : ${ white + process.env.DB_URL + ":" + process.env.DB_PORT + white }
   TIME : ${ magenta + new Date().toISOString() + white } (GMT)
   LOG  : ${ white + process.env.SHOW_CONSOLE_LOG_LEVEL + white }
============================================
`);
});
