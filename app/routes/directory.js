var mongoose = require("mongoose");
var Recipient = require("./recipient");

mongoose.connect('mongodb://localhost/greenhornet');

var db = mongoose.connection;
var connected = false;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	connected = true;
});

module.exports = {

	get: function(req, res, next) {
		Recipient.Model.find({ }, function(err, recipients) {
			res.send(recipients);
		});
	}
}