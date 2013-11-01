var restify = require('restify'),
    mongoose = require('mongoose'),
    Recipient = require('./recipient'),
    assert = require('assert');

module.exports = {
	post: function(req, res, next) {
		
		if (!req.params.recipient_id) {
			return next(new restify.MissingParameterError("Missing parameter recipient_id"));
		}
		var recipient_id = req.params.recipient_id;
		Recipient.Model.findOne({ recipient_id: recipient_id }, function(err, recipient) {
			assert.ifError(err);
			var client = restify.createJsonClient({ url: recipient.url });
			client.get("/recipient/public_key", function(err, req, getres, obj) {
				assert.ifError(err);
				response = {
					public_key: obj.public_key,
					message_id: obj.message_id
				}
				console.log("Initiated message process for %s", recipient.name);
				res.send(response);
			});
		});
	}
}