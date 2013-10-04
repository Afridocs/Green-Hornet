var restify = require('restify');
// var mongoose = require('mongoose');

// Controllers
var public_key = require('./controllers/public_key.js');
var message = require('./controllers/message.js');
var recipient = require('./controllers/recipient.js');
var directory = require('./controllers/directory.js');

// Set up server
var server = restify.createServer();
server.use(restify.bodyParser());

// PPK Routes
server.post("/api/public_key", public_key.post);
server.head("/api/public_key", public_key.post);
server.get("/recipient/public_key", recipient.public_key);

// Messaging Routes
server.post("/api/message", message.post);
server.post("/recipient/message", recipient.message);

// Directory Service Routes
server.get("/api/directory", directory.get);

// Start server
server.listen(3000, function() {
	console.log("%s listening at %s", server.name, server.url);
});