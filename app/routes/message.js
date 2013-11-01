var ursa = require("ursa");
var restify = require("restify");
var mongoose = require("mongoose");
var Recipient = require("./recipient");
var assert = require("assert");

module.exports = {
	post: function(req, res, next) {
		if (!req.params.recipient_id) {
			return next(new restify.MissingParameterError("Missing parameter recipient_id"));
		}
		if (!req.params.message_id) {
			return next(new restify.MissingParameterError("Missing parameter message_id"));
		}
		if (!req.params.message) {
			return next(new restify.MissingParameterError("Missing parameter message"));
		}

		var message_enc = req.params.message;
		var recipient_id = req.params.recipient_id;
		var message_id = req.params.message_id;


		//Send to peeps
		Recipient.Model.findOne({ recipient_id: recipient_id }, function(err, recipient) {
			assert.ifError(err);
			var client = restify.createJsonClient({ url: recipient.url });
			client.post("/recipient/message", { message: message_enc, message_id: message_id }, function(err, req, getres, obj) {
				assert.ifError(err);
				console.log("Initiated message process for %s", recipient.name);
				res.send({ ack: true });
			});
		});
	}
}