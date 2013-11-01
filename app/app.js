
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes/index'),
    user = require('./routes/user'),
    public_key = require('./routes/public_key'),
    message = require('./routes/message'),
    recipient = require('./routes/recipient'),
    directory = require('./routes/directory'),
    http = require('http'),
    path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post("/api/public_key", public_key.post);
//app.get("/api/recipient/public_key", recipient.public_key);

// Messaging Routes
app.post("/api/message", message.post);
app.post("/api/recipient/message", recipient.message);

// Directory Service Routes
app.get("/api/directory", directory.get);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
