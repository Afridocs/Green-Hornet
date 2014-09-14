var mongoose = require("mongoose");
var Recipient = require("../models/recipient");
var assert = require("assert");

mongoose.connect('mongodb://localhost/greenhornet');

var db = mongoose.connection;
var connected = false;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	connected = true;
});

module.exports = {

	recipient: {
		post: function(req, res, next) {
			// Recipient.Model.find({ }, function(err, recipients) {
			// 	res.send(recipients);
			// });
			res.send("Not implemented");
		},

		put: function(req, res, next) {
			console.log("Put recieved");
			assert(connected);
			var recipient = {
				name: req.params.name,
				url: req.params.url
			};
			Recipient.Model.insert(recipient, function(err, data) {
				console.log(err);
				res.send({err: err, data: data});
			});
			
		},

		del: function(req, res, next) {
			res.send("Not implemented");
		}
	}
	
}