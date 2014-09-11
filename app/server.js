var restify = require('restify');
// var mongoose = require('mongoose');

// Controllers
//<<<<<<< Updated upstream
var public_key = require('./routes/public_key.js');
var message = require('./routes/message.js');
var recipient = require('./routes/recipient.js');
var directory = require('./routes/directory.js');
//=======
//var public_key = require('./controllers/public_key.js');
//var message = require('./controllers/message.js');
//var recipient = require('./controllers/recipient.js');
//var directory = require('./controllers/directory.js');
//var admin = require('./controllers/admin.js');
//>>>>>>> Stashed changes

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

//Admin Routes
server.put("/admin/recipient", admin.recipient.put);
server.del("/admin/recipient", admin.recipient.del);
server.post("/admin/recipient", admin.recipient.post);

// Start server
server.listen(3000, function() {
	console.log("%s listening at %s", server.name, server.url);
});
